const db = require("../models/index");
const {
  User,
  Jobs,
  Property,
  Estimates,
  proofofwork,
  proofofwork_images,
  chats,
  channels,
  messages,
} = db;
const { Server } = require("socket.io");
const Sequelize = require("sequelize");
const { getIO } = require("../utils/socket");

require("dotenv").config();


const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { reciverId, propertyId, message } = req.body;

    const messagesData = await messages.create({
      property_id: propertyId,
      senderID: senderId,
      recieverID: reciverId,
      message: message,
    });

    if (!messagesData) {
      return res.json({
        success: false,
        msg: "Message not Sent",
      });
    }

    io = getIO();
    io.emit(`send_message-${reciverId}`, messagesData);

    // console.log("ID::::" , `send_message-${reciverId}`)

    return res.json({
      success: true,
      msg: "Messane Sent SuccessFully",
      data: messagesData,
    });
  } catch (error) {
    console.error("Some Error: ", error);
  }
};

const getMessages = async (req, res) => {
  try {

    console.log("params ID is: " , req.params.cid)
    // const id = req.params.cid;

    const getMessages = await messages.findAll({
      where: {
        [Sequelize.Op.or]:[
          { senderID:req.user.id , recieverID:req.params.cid },
          { senderID:req.params.cid , recieverID:req.user.id },
        ]
      },
    }); 

    // console.log("Messages: " , getMessages)
    // console.log("Length: " , getMessages.length)

    if (!getMessages.length) {
      return res.json({
        success: false,
        msg: "Data not Found",
      });
    }

    return res.json({
      success: true,
      msg: "Data Found...",
      data: getMessages,
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
 
};
