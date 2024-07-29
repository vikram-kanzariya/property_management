const db = require('../models/index');
const { Estimates , channels , Property } = db;
require('dotenv').config();

const submitEstimate = async(req , res) => {
  try {
    const { amount , time } = req.body;
    const propertyId = req.params.id;
    const contractorId = req.user.id;

    const ownerId = await Property.findOne({
      where:{ id:propertyId }
    })

    if(!amount || !time){  
      return res.json({
        success:false,
        message:"Please Enter All Fields",
      });
    }


    const addEstimate = Estimates.create({
      contractor_name:req.user.fname,
      contractor_id:contractorId,
      property_id:propertyId,
      amount:amount,
      time:time,
    });

    console.log("Data: " ,addEstimate)

    if(addEstimate.length <= 0){
      return res.json({
        success:false,
        message:"Error While Creating Estimate...",
      });
    }

      await channels.create({
        property_id:propertyId,
        owner_id:ownerId.owner_id,
        contractor_id:req.user.id,
      });

    return res.json({
      success:true,
      message:"Estimate Submitted SuccessFully...",
      // EstimateData:addEstimate,
      ownerID:ownerId.owner_id
    });

    
  } catch (error) {
    console.error("Some Error: " , error);
  }
};

const getEstimates = async(req , res) => {
  try {
    const estimateData = await Estimates.findAll({
      where:{ property_id:req.params.id }
    });


    if(!estimateData){
      return res.json({
        success:false,
        message:"Something Went Wrong While Fetching Estimates...",
      })
    }

    return res.json({
      success:true,
      message:"Estimates Found SuccesFully",
      data:estimateData,
    })
  } catch (error) {
    console.error("Some Error Occured: " , error);
  }
};

module.exports = { submitEstimate , getEstimates };