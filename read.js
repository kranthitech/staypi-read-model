var Promise = require("bluebird")
var fs = require("fs")
var _ = require("lodash")

Promise.promisifyAll(fs)

function readModels(){

	this.loadModelFromFolder = loadModelFromFolder
	this.loadModelsFromFolder = loadModelsFromFolder
	this.attachModel = attachModel

	var attachments = ['actions','attributes','relations','states']

	/**
	 * @param  {String} model_path Folder from which the model is to be created
	 * @param {String} model_name Name to be given to the model
	 * @return {Promise}  A promise that resolves with the model if successfully loaded or rejects with error message
	 */
	function loadModelFromFolder(model_path, model_name){
		var model = {}
		
		for(var i in attachments){

			var attachment = attachments[i]
			var attachment_path = model_path+'/'+model_name+'_'+attachments[i]+'.json'
			
			if(fs.existsSync(attachment_path)){

				var attached = _.attempt(requireAttachment, attachment_path)
			
				if( _.isError(attached) ){
					console.log('Error while requiring '+attachment_path)
				}else{
					model[attachment] = require(attachment_path)
				}

			}else{
				//console.log('attachment path '+attachment_path+' does not exist')
			}
		}

		return Promise.resolve(model)
	}

	function requireAttachment(attachment_path){		
		return require(attachment_path)
	}
	/**
	 * @param  {String} top_folder Folder from which model is to be created
	 * @return {Promise} A promise that resolves with the generated models if successfully loaded or rejects with error message
	 */
	function loadModelsFromFolder(top_folder){
		var models = {}

		return fs.readdirAsync(top_folder)
		.map(function(model_name){
			
			//bluebird promise can use map, like then
			
			//look for required files inside model_name
			
			var model_path = top_folder+'/'+model_name
			
			return loadModelFromFolder(model_path, model_name)
			.then(function(model){
				return Promise.resolve({name:model_name,model:model})
			})
			
			
		})
		.then(function(computed){
			_.forEach(computed,function(item){
				attachModel(models, item.model, item.name)
			})
			return Promise.resolve(models)
		},function(err){
			console.log('Some error after map\n%j',err)
		})
		.catch(function(err){
			console.log('error while reading folder\n %j',err)
		})
	}

	/**
	 * @param  {Object} Models object on which the new model is to be attached
	 * @param  {Object} The model to be attached
	 * @return {boolean} Has the model been attached successfully?. Input models is updated with the new model 
 	 */
	function attachModel(models,model, name){
		models[name] = model

		return true
	}
}

module.exports = new readModels()