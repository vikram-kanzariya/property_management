const { Op } = require('sequelize');
const db = require('../models/index');
const { User , Roles , Property , Jobs , Job_images , Estimates } = db;
require('dotenv').config();

const acceptEstimate = async(req , res) => {
  try {

    const estimateId = req.body.estimateId;
    const property_id = req.body.propertyId;

    // console.log("EstimateId: " , estimateId);
    // console.log("PropertyId: ",  property_id)
    
    const accept = await Estimates.update(
      { status:"Accepted" },
      { where:{
        id:estimateId
      }}
    );

    await Estimates.destroy({
      where:{
        id:{
          [Op.ne]:estimateId,
        }
      }
    });

    // await Jobs.update({
    //   job_status:"in-Progress",
    //   where:{ propertyId:property_id }
    // });

    await Jobs.update(
      { job_status:"in-progress" },
      { where:{ propertyId:property_id }},
    )

    if(!accept){
      return res.json({
        success:true,
        message:"Error While Accepting Estimate",
      });
    }

    return res.json({
      success:true,
      message:"Estimate Accepted SuccessFully..."
    });

  } catch (error) {
    console.error("Some Error: " , error);
  }
};

const rejectEstimates = async(req , res) => {
  try {
    const estimateId = req.body.estimateId;

    // console.log("EstimateID: " , estimateId);
    // console.log("PropertyID: " , propertyId);

    // const reject = await Estimates.destroy({
    //   where:{
    //     id:estimateId,
    //   }
    // });

    const reject = await Estimates.update(
      { status:"Rejected" },
      { where:{ id:estimateId }, }
    );

    if(!reject){
      return res.json({
        success:false,
        message:"Something Went Wrong",
      });
    }
  } catch (error) {
    console.error("some Error Occured: ", error);
  }
};

const WorkProof = async(req , res) => {
  return res.render('WorkProof')
}

const reviewEstimate = async(req , res) => {
  try {
    const reviewData = await Estimates.findAll({
      attributes:['amount' , 'time' , 'status' , 'property_id' , 'contractor_id',
      [db.Sequelize.col('Property.property_name') , 'property_name'],
      [db.Sequelize.col('Property.owner_id') , 'owner_id'],
    ] , 

    include:{
      model:Property,
      attributes:[],
    },
      where:{ contractor_id:req.user.id },
      raw:true,
    });

    // const ownerId = await Property.findAll({
    //   where:{ id:reviewData.property_id }
    // });
    // console.log("PID: " , pid)

    // console.log('Data: ' , reviewData)



    if(!reviewData){
      return res.json({
        success:false,
        message:"Data not Found"
      })
    }

    return res.json({
      success:true,
      message:"data Found SucesFully",
      data:reviewData,
      // PID:pid
    })

    // console.log("ReviewedData: " , reviewData);
  } catch (error) {
    console.error("Some Error Occured: " , error);
  }
}

module.exports = { acceptEstimate , rejectEstimates , WorkProof , reviewEstimate }