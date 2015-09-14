var staypiRead = require('../read')
var expect = require('chai').expect


describe('Staypi', function() {

    describe('Read Model', function() {
        it('should load a model from a folder as expected', function(done) {
            staypiRead.loadModelFromFolder('./test/test_models_user/User','User')
            .then(function(model) {
                // Check if all the deep properties exist
                expect(model).to.have.property('relations')
                expect(model).to.have.deep.property("attributes.properties")                
                expect(model).to.have.deep.property("actions.verify.operation")
                expect(model).to.have.deep.property("states.transitions.created.verify")
          
                done()
            }, function() {

            })
        })

        it('should load models from a folder as expected', function(done) {
            staypiRead.loadModelsFromFolder('./test/test_models_user')
            .then(function(models) {
                console.log('Models')
                console.log('%j',models)
                // Check if all the deep properties exist
                expect(models).to.have.deep.property('User.relations')
                expect(models).to.have.deep.property("User.attributes.properties")                
                expect(models).to.have.deep.property("User.actions.verify.operation")
                expect(models).to.have.deep.property("User.states.transitions.created.verify")
          
                done()
            })
        })

        it('should attach new model to existing models',function(done){
        	var models = {}, attached = false
        	staypiRead.loadModelFromFolder('./test/test_models_user/User','User')
        	.then(function(user_model){
        		attached = staypiRead.attachModel(models, user_model,'User')
				expect(attached).to.equal(true)

				staypiRead.loadModelFromFolder('./test/test_models_user/Website','Website')
				.then(function(website_model){
					attached = staypiRead.attachModel(models,website_model,'Website')

					expect(attached).to.equal(true)

					expect(models).to.have.deep.property("User.attributes.properties")                
	            	expect(models).to.have.deep.property("User.actions.verify.operation")
	            	expect(models).to.have.deep.property("User.states.transitions.created.verify")

	            	expect(models).to.have.deep.property("Website.attributes.properties")                
	            	expect(models).to.have.deep.property("Website.actions")
	            	
	            	done()
				})

        		
        	})
        })


    });

});
