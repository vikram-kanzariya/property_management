const { Op } = require("sequelize");
const db = require("../models/index");
const { User, Jobs, Property, Estimates, proofofwork, proofofwork_images } = db;
require("dotenv").config();

const findApprovedProperties = async (req, res) => {
  try {
    const data = await Estimates.findAll({
      attributes: [
        "status",
        "contractor_id",
        [db.Sequelize.col("Property.id"), "property_id"],
        [db.Sequelize.col("Property.property_name"), "property_name"],
        [db.Sequelize.col("Property.address"), "address"],
        [db.Sequelize.col("Property.image"), "image"],
      ],

      include: {
        model: Property,
        attributes: [],
      },

      where: {
        contractor_id: req.user.id,
        status: "Accepted",
      },
      raw: true,
    });

    if (!data) {
      return res.json({
        success: false,
        message: "Data Not Found.",
      });
    }

    return res.json({
      success: true,
      message: "Data Found SuccessFully",
      data: data,
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

const submitworkofProof = async (req, res) => {
  try {
    const { title, description, property_id } = req.body;
    const files = req.files;

    // console.log("Body: ", req.body);
    // console.log("Images: ", files);

    const proofofWork = await proofofwork.create({
      property_id: property_id,
      contractor_id: req.user.id,
      work_title: title,
      work_description: description,
    });

    let proof_images;
    for (let i = 0; i < req.files.length; i++) {
      proof_images = await proofofwork_images.create({
        proofofwork_id: proofofWork.id,
        image: req.files[i].path.slice(6),
      });
    }

    if (!proof_images || !proofofWork) {
      return res.json({
        success: false,
        message: "Some Error Occured",
      });
    }

    return res.json({
      success: true,
      message: "Work of Proof Submitted Successfully",
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

const getWorkHistory = async (req, res) => {
  try {
    const historyData = await Property.findAll({
      attributes: ["owner_name", "property_name", "address" , "owner_id"],

      include: [
        {
          model: proofofwork,
          include: [
            {
              model: proofofwork_images,
            },
          ],
        },
      ],

      where: { owner_id: req.user.id },
      // raw:true,
    });

    if (historyData.length == 0) {
      return res.json({
        success: false,
        message: "Data Not Found",
      });
    };

    return res.json({
      success: true,
      message: "Data Found SuccessFully",
      data: historyData,
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

const rejectWork = async (req, res) => {
  try {
    const workId = req.body.id;
    const comment = req.body.comment;

    // console.log("ID: " , workId);
    // console.log("Comment: ", comment)

    const reject = await proofofwork.update(
      // status: "Rejected",
      // comment: comment,
      // {
      //   where:{ id: workId }
      // },

      { status:"Rejected" , 
        comment:comment 
      },
      { where:{ id:workId } }
    );

    if (!reject) {
      return res.json({
        success: false,
        message: "Error While Rejecting Work",
      });
    }

    return res.json({
      success: true,
      message: "Work has been Rejected",
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

const acceptWork = async (req, res) => {
  try {
    const workId = req.body.id;
    const comment = req.body.comment;

    const accept = await proofofwork.update(
     
      { status:"Accepted" , comment:comment },
      { where:{ id:workId } },
    );

    if (!accept) {
      return res.json({
        success: false,
        message: "Error While Accepting Work",
      });
    }

    await Jobs.update(
      { job_status:"Completed" },
      {
        where:{ property_id:1 },
      }
    );

    return res.json({
      success: true,
      message: "Work has been Accepted",
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

const getProofStatus = async(req ,res) => {
  try {
    const data = await proofofwork.findAll({
      include:proofofwork_images,

      where:{ contractor_id:req.user.id },
    });

    if(!data){
      return res.json({
        success:false,
        message:"Data Not Found",
      });
    }

    // console.log("data is: " , data)
    return res.json({
      success:false,
      message:"Data Found SuccessFully",
      data:data
    });
  } catch (error) {
    console.error("Some Error Occured: " , error);
  }
}

module.exports = {
  findApprovedProperties,
  submitworkofProof,
  getWorkHistory,
  acceptWork,
  rejectWork,
  getProofStatus,
};
