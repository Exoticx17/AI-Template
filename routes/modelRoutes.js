const express = require('express');
const modelController = require('../controllers/modelController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Define routes and link them to controller functions
router.post('/text', modelController.getTextPredictions);
router.post('/image', upload.single('file'), modelController.getImagePredictions);
router.post('/regression', modelController.getRegressionPreds);
router.patch('/addimage', modelController.addLikeImage);
router.patch('/addtext', modelController.addLikeText);
router.patch('/ridimage', modelController.ridLikeImage);
router.patch('/ridtext', modelController.ridLikeText);
router.get('/gettext', modelController.getText);
router.get('/getimagemetadata', modelController.getImageMetdata);
router.get('/getimagepic', modelController.getImage);
router.post('/samples', modelController.getSamplesBasedOnPercentages);
module.exports = router;