const { generalResponse } = require('../helpers/response.helper');
const { registerUser } = require('../repository/user.repository');
const bcrypt = require('bcrypt');
const db = require('../models/index');
const { User , Roles , Property , Jobs , Job_images } = db;
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { JSON } = require('sequelize');
const path = require('path');
const job_images = require('../models/job_images');
require('dotenv').config();

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// Multer
const propertyStorage = multer.diskStorage({
  destination:function(req , file , cb){
    cb(null , './public/uploads');
  },
  filename:function(req , file , cb){
    cb(null , Date.now() + '-' + file.originalname)
  }
});

const createUser = async(req , res) => {
  try {
    const { fname , lname , email , number , password , cpassword } = req.body;
    
    const bcryptSalt = bcrypt.genSaltSync(10);  
    const hassedPassword = await bcrypt.hash(password , bcryptSalt);
    let role = req.body;

    if(!fname || !lname || !email || !number || !password || !role){
      return res.json({ 
        message:"All fields are required..." ,
        success:false
      });
    }

    if(email && !isValidEmail){
      return res.json({ 
        message:"Email is not valid...",
        success:false
      });
    }

    if(number && number.length != 10){
      return res.json({ 
        message:"Mobile Number Should be of 10-digits" ,
        success:false
      });
    }

    if(password != cpassword){
      return res.json({
        success:false,
        message:"Password is Wrong...",
      })
    };

    const query = await User.findOne({
      where:{ email:email },
    })

    if(query){
      return res.json({
        success:false,
        message:"User Already Exists"
      });
    };

    // role = JSON.stringify(role[0].id);
    // role = JSON.parse(role);

    if(role.role == 'property_owner'){
      role = 1;
    }
    else {
      // console.log("Role is: " , role);
      role = 2;
      // console.log("Role is: " , role);
    }

    const newUser = await registerUser({
      roleId:role,
      fname:fname,
      lname:lname,
      email:email,
      number:number,
      password:hassedPassword,
    });

    if(newUser.length == 0){
      return res.json({ 
        success:false , 
        message:"Error While Registration",
      });
    }
    return generalResponse(res , newUser , 'New User Inserted Successfully' , true);

  } catch (error) {
    console.error("Some Error: " , error);
    return generalResponse(
      res,
      { success: false },
      "Something went wrong while fetching users!",
      "error",
      true
    );
  }
};

const loginUser = async(req , res) => {
 try {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.json({
        success:false,
        message:"Please Enter All Fields..."
    });
  }

  if(email && (!isValidEmail(email))){
    return res.json({
        success:false,
        message:"Please Enter Correct Credentials..."
    });
  }

  let sql= await User.findAll({
    where:{ email:email }
  });

  if(sql.length <= 0){
    return res.json({
      success:false,
      message:'User does not exist',
    });
  };

  let userPassword = sql[0].password;
  let userEnterdPassword = password;

  let id = sql[0].id;
  let roleId = sql[0].roleId;

  let payload = {
    id:id,
    roleId:roleId,
    fname:sql[0].fname,
    lname:sql[0].lname,
    email:sql[0].email,
  };

  let token = jwt.sign(payload , process.env.JWT_SECRET);

  let { password:_ , ...newObj } = sql[0];
  newObj.token = token;

  if(await bcrypt.compare(userEnterdPassword , userPassword)){

    return res.cookie('token' , token).json({
      success:true,
      message:"Login success",
      id:id,
      // token:token,
      token:newObj,
  });
  }
  else{
    console.log('Login Failed');
    return res.json({
      success:false,
      message:"Login Failed...",
    })
  }
 } catch (error) {
  console.error("Some Error Occured: " , error);
 }

}

const logOut = async(req , res) => {
  try {
    return res.clearCookie('token').json({
      success:true,
      message:"LogOut SuccessFully",
    })
  } catch (error) {
    console.error("Some Error: " , error);
  }
}


const addWork = async(req , res) => {
  try {
    const id = req.params.id;
    const { title , description } = req.body;

    console.log(req.body)
    // const t = await sequelize.transaction();
    
    let removeDuplicate = req.files.reduce((acc , curr) => {
      if(!acc.includes(curr.fieldname)){
        acc.push(curr.fieldname);
      }
      return acc;
    }, []);
    
    
    let jobsData , imagesData;
    for(let i=0 ; i<title.length ; i++){
      jobsData = await Jobs.create({
        propertyId:id,
        title:title[i],
        description:description[i],
      }
    );

      req.files.forEach((element) => {
        if(element.fieldname == removeDuplicate[i]){
          imagesData = Job_images.create({
            job_id:jobsData.id,
            images:element.path.slice(6),
          })
        }
      });

    }

    console.log(jobsData)

    if(jobsData.length <= 0) {
      return res.json({
        success:false,
        message:"Error While Creating Jobs",
      });
    }

    return res.json({
      success:true,
      message:"Jobs Created SuccessFully",
      jobData:jobsData,
      images:imagesData,
    });

  
  } catch (error) {
    console.error("some Error Occurd: " , error);
  }
}

const getAllJobs = async(req , res) => {
  try {
    const jobs = await Jobs.findAll({
      attributes:['title' , 'description' , 'job_status' ,
        [db.Sequelize.col('Job_images.images') , 'images']
      ],

      include:{
        model:Job_images,
        attributes:[],
      },
      where:{ propertyId:req.params.id },
      raw:true
    });

    // console.log("Jobs Data: " , jobs);

    if(jobs.length <= 0){
      returnres.json({
        success:false,
        message:"Jobs not Found"
      })
    }

    return res.json({
      success:true,
      message:"Jobs Found SuccessFully",
      data:jobs
    })
  } catch (error) {
    console.error("Some Error Occured: " , error);
  }
}

const createProperty = async(req , res) => {
  try {
    const { owner_name , property_name , address } = req.body;
    const property_image = req.files;

    const newProperty = await Property.create({
      owner_id:req.user.id,
      owner_name:owner_name,
      property_name:property_name,
      address:address,
      image:property_image[0].path.slice(6),
    });

    if(newProperty.length == 0){
      return res.json({
        success:false,
        message:"Some Error While Creating New Property",
        data:newProperty,
      });
    }
    return res.json({
      success:true,
      message:"Property Created SuccessFully..."
    });
  } catch (error) {
    console.error("Some Error Occured..." , error);
  }
};

const contractorHomePage = async(req , res) => {
  return res.render('ContractorHome');
}

const propertyHomePage = async(req , res) => {
  return res.render('PropertyHome');
}

const getJobsContractorSide = async(req , res) => {
  try {
    const allJobs = await Jobs.findAll({
      attributes:['title' , 'description' , 'job_status' , 'propertyId',
      [db.Sequelize.col('Property.image') , 'image'],
    ],

      include:[
        {
          model:Job_images,
          attributes:[],
        },
        {
          model:Property,
          attributes:[],
        }
    ],

      where:{ job_status:"created" },
      raw:true,
    });        

    if(!allJobs){
      return res.json({
        success:false,
        message:"Jobs not Found",
      })
    };

    // console.log(allJobs)

    let newArrayofJobs = allJobs.reduce((acc , curr) => {
      if(!acc[curr.propertyId]){
        acc[curr.propertyId] = [];
      }
      acc[curr.propertyId].push({
        id:curr.propertyId,
        title:curr.title,
        description:curr.description ,
        status:curr.job_status,
        image:curr.image
      });
      return acc;
    } , {});

    // console.log("new Array: " , newArrayofJobs)

    return res.json({
      success:true,
      message:"Jobs Found SuccessFully",
      data:newArrayofJobs,
    }) 
  } catch (error) {
    console.error("Some Error: " , error);
  }
};

const getPropertiesPropertySide = async(req , res) => {
  try {
    console.log("Logged in User: " , req.user.id);
    const data = await Property.findAll({
      where:{ owner_id:req.user.id }
    });

    if(data.length == 0){
      return res.json({
        success:false,
        message:"Something Went Wrong"
      });
    }
    return res.json({
      success:true,
      message:"Properties Found SuccessFully",
      property:data,
    })
  } catch (error) {
    console.error("Some Error: " , error);
  }
};


module.exports = { 
  createUser,
  loginUser,
  createProperty,
  propertyStorage,
  getPropertiesPropertySide,
  getJobsContractorSide,
  contractorHomePage,
  propertyHomePage,
  logOut,
  addWork,
  getAllJobs,
};