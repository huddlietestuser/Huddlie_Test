var mongoose = require('../models/mongooseUtil.js').mongooseItem;

var schema = mongoose.Schema;

var feedbackSchema = new schema({
	feedbackArray: {type: Array, required: true},
	feedbackId: {type: String, required: true}
}, {collection: 'shortFeedback-data'});

var FeedbackData = mongoose.model('ShortFeedbackData', feedbackSchema);

var createUpdateFeedback = function (feedback, attemptNumber, cb){
	var feedbackId = feedback.feedbackId;
	var feedbackText = feedback.feedbackText;

	FeedbackData.findOne({'feedbackId':feedbackId}, function(err, doc){
		if (err || doc == null){
			var data = new FeedbackData;

			var feedbackArray = [];
			feedbackArray.push(feedbackText);

			data.feedbackArray = feedbackArray;
			data.feedbackId = feedbackId;

			data.save(function (err, doc){
				if (err){
					cb(false, attemptNumber+1, feedback);
				}
				else
				{
					cb(true);
				}
			});
		}
		else
		{
			doc.feedbackArray.push(feedbackText);
			doc.save();
			setTimeout(function(){
				cb(true);
			}, 1000);
		}
	});
}

exports.createUpdateFeedback = createUpdateFeedback;
