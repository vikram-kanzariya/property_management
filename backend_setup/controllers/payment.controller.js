const db = require("../models/index");
const { payment, Property, Estimates, proofofwork, Jobs } = db;
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentController = async (req, res) => {
  try {
    const { PID, CID, OID } = req.body;

    const { property_name } = await Property.findOne({
      where: { id: PID },
    });

    const findProperty = await proofofwork.findOne({
      where: {
        property_id: PID,
        status: "Accepted",
      },
    });

    const { amount } = await Estimates.findOne({
      where: {
        property_id: findProperty.property_id,
        contractor_id: findProperty.contractor_id,
      },
      raw: true,
    });

    // console.log("Amount: " , amount)
    // console.log("Amount is: " , amount.amount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: property_name,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:8080/success",
      cancel_url: "http://localhost:8080/error",
    });

    await payment.create({
      owner_id: OID,
      contractor_id: CID,
      property_id: PID,
      amount: amount,
      session_id: session.id,
    });

    res.json({
      id: session.id,
      success: true,
      message: "API Testing Successfull",
    });
  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

const successPayment = async (req, res) => {
  try {
    const sessionId = req.params.sessionID;

    const paymentData = await payment.findOne({
      where: { session_id: sessionId },
    });

    const payment_id = paymentData.id;
    const property_id = paymentData.property_id;

    const updatePaymentStatus = await payment.update({
      status: true,
      where: {
        id: payment_id,
      },
    });

    const proofUpdate = await proofofwork.update({
      status:"payment-done",

      where:{
        property_id:property_id,
        contractor_id:paymentData.contractor_id,
        status:'Accepted',
      }
    });

    await Jobs.update({
      job_status:"job-completed",
      where:{
        propertyId:property_id,
        job_status:'in-progress',
      }
    })

    
    // const estimation = await Estimates.findOne({
    //   where: {
    //     status: "Accepted",
    //     property_id: property_id,
    //   },
    // });
    // const completed = await Jobs.update({
    //   job_status:'in-progress',
    //   propertyId:property_id
    // });

    res.json({
      success:true,
      message:"Payment Completed SuccessFully",
    })

  } catch (error) {
    console.error("Some Error Occured: ", error);
  }
};

module.exports = { paymentController, successPayment };
