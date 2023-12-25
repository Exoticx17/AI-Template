const fetch = require('node-fetch');
const mongodb = require('mongodb');
const User = require('../models/userModel');
const { ObjectId } = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/AI?retryWrites=true&w=majority';

// Function to fetch predictions for image data from Flask API
const axios = require('axios');
const FormData = require('form-data');

const getImagePredictions = async (req, res) => {
  try {
    const image = req.file; // Assuming req.file holds the image file from multer
    const user = req.body.user;

    const formData = new FormData();
    formData.append('image', image.buffer, { filename: image.originalname });

    const axiosConfig = {
      headers: {
        ...formData.getHeaders() // Set proper headers for form data
      }
    };

    const flaskResponse = await axios.post('http://127.0.0.1:5000/predict_image', formData, axiosConfig);
    const predictions = flaskResponse.data;
    const category = predictions.image_prediction;

    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'images' });

    const uploadStream = bucket.openUploadStream(image.originalname, {
      contentType: image.mimetype
    });
    const imageId = uploadStream.id;

    // Store additional metadata in a separate collection
    const metadata = {
      fileId: imageId,
      user: user,
      category: category,
      likes: 0,
      likedList: [],
      type: 'image'
    };
    const result = db.collection('imageMetadata').insertOne(metadata)
    res.json({ id: imageId});
    uploadStream.end(image.buffer, async (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading the image' });
      }});
  } catch (error) {
    console.error('Error calling second API:', error.message);
    return res.status(500).json({ error: 'Error calling second API' });
  }
};


const getTextPredictions = async (req, res) => {
  try {
    const textToPredict = req.body.text; // Replace with your text data

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const flaskResponse = await axios.post('http://127.0.0.1:5000/predict_text', { text: textToPredict }, axiosConfig);

    const predictions = flaskResponse.data;
    const category = predictions.text_category;

    // Assuming your MongoDB operations remain unchanged
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const newText = await db.collection('text').insertOne({
      text: req.body.text,
      category: category,
      user: req.body.user,
      likes: 0,
      likedList: [],
      type: 'text'
    });

    client.close();
    res.status(201).json(newText);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching text predictions' });
  }
};

const getRegressionPreds = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');
  
    const user = await User.findById(req.query.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    const numberFields = [user.physics, user.biology, user.chemistry, user.nike, user.adidas, user.converse,];

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const flaskResponse = await axios.post('http://127.0.0.1:5000/predict_regression', { array: numberFields }, axiosConfig);

    const predictions = flaskResponse.data;
    const favorite = predictions.favorite_regression_prediction;
    const ratings = predictions.regression_ratings;

    const biology = ratings.Biology;
    const physics = ratings.Physics;
    const chemistry = ratings.Chemistry;
    const nike = ratings.Nike;
    const adidas = ratings.Adidas;
    const converse = ratings.Converse;

    const array = [physics, biology, chemistry, nike, adidas, converse]
    
    const update = await User.findOneAndUpdate({_id: req.query.id }, {
      $set :{
        favoriteCategory: favorite
      }
    });

    client.close();
    res.status(201).json(array); 
  } catch (error) {
    res.status(500).json({ error: 'Error fetching regression predictions' });
  }
};


const addLikeText = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const filter = { _id: new ObjectId(req.query.id) };
    const update = {
      $inc: { likes: 1 },
      $push: { likedList: req.query.userId }, // Add userId to the likedList
    };

    const result = await db.collection('text').updateOne(filter, update);
    client.close();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addLikeImage = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const filter = { _id: new ObjectId(req.query.id) };
    const update = {
      $inc: { likes: 1 },
      $push: { likedList: req.query.userId }, // Add userId to the likedList
    };

    const result = await db.collection('imageMetadata').updateOne(filter, update);
    client.close();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const ridLikeText = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const filter = { _id: new ObjectId(req.query.id) };
    const update = {
      $inc: { likes: -1 },
      $pull: { likedList: req.query.userId }, // Add userId to the likedList
    };

    const result = await db.collection('text').updateOne(filter, update);
    client.close();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ridLikeImage = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const filter = { _id: new ObjectId(req.query.id) };
    const update = {
      $inc: { likes: -1 },
      $pull: { likedList: req.query.userId }, // Add userId to the likedList
    };

    const result = await db.collection('imageMetadata').updateOne(filter, update);
    client.close();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getText = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const filter = { _id: new ObjectId(req.query.id) };

    const result = await db.collection('text').find(filter).toArray();
    client.close();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImageMetdata = async (req, res) => {
  try {
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    const filter = { _id: new ObjectId(req.query.id) };

    const result = await db.collection('imageMetadata').find(filter).toArray();
    client.close();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getImage = async (req, res) => {
  try {
    // Connect to the MongoDB database
    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');
    const bucket = new mongodb.GridFSBucket(db, { bucketName: 'images' });

    // Convert the req.query.id to ObjectId
    const fileId = new ObjectId(req.query.id);

    // Retrieve the file's content by the provided _id
    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      res.status(404).send({ message: 'File not found' });
    } else {
      const file = files[0];
      res.set('Content-Type', file.contentType);
      bucket.openDownloadStream(file._id).pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error retrieving file content' });
  }
};

const getSamplesBasedOnPercentages = async (req, res) => {
  try {
    const regression_categories = {
      0: 'Physics',
      1: 'Biology',
      2: 'Chemistry',
      3: 'Nike',
      4: 'Adidas',
      5: 'Converse'
    };

    const percentages = req.body.percentages;
    const totalSamples = 50;

    const fetchedImages = {};
    const fetchedTexts = {};

    const client = await mongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    const db = client.db('AI');

    for (let i = 0; i < percentages.length; i++) {
      const category = regression_categories[i];
      const percentage = percentages[i];
      const count = Math.floor(totalSamples * percentage);

      if (i < 3) {
        // For text categories
        const textsResult = await db.collection('text')
          .aggregate([{ $match: { category } }, { $sample: { size: count } }])
          .toArray();

        fetchedTexts[category] = textsResult;
      } else {
        // For image categories
        const imagesResult = await db.collection('imageMetadata')
          .aggregate([{ $match: { category } }, { $sample: { size: count } }])
          .toArray();

        fetchedImages[category] = imagesResult;
      }
    }

    client.close();

    res.status(200).json({ images: fetchedImages, texts: fetchedTexts });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching samples based on percentages' });
  }
};

module.exports = {
  getImagePredictions,
  getTextPredictions,
  addLikeText,
  addLikeImage,
  getText,
  getImage,
  getImageMetdata,
  getRegressionPreds,
  getSamplesBasedOnPercentages,
  ridLikeImage,
  ridLikeText
};
