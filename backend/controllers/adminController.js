const Admin = require("../models/admin");
const ServiceReport = require("../models/serviceReport");
const Contract = require("../models/contract");

const addValues = async (req, res) => {
  try {
    await Admin.create(req.body);
    res.status(201).json({ msg: "Added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

const allValues = async (req, res) => {
  try {
    const allValues = await Admin.find({});
    res.status(200).json({ allValues });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

const serviceCards = async (req, res) => {
  const { contract } = req.query;
  try {
    const cont = await ServiceReport.find({ contract }).select(
      "contract serviceName image serviceDate"
    );
    if (cont.length <= 0)
      return res.status(404).json({ msg: "No Contract Found" });

    const cards = [];

    for (let i = cont.length - 1; i >= 0; i--) {
      if (cards.length > 0 && cont[i].image.length > 0) {
        let temp = cards.filter(
          (item) => item.serviceName === cont[i].serviceName
        );
        if (temp.length === 0) cards.push(cont[i]);
      } else {
        cards.push(cont[i]);
      }
    }
    res.status(200).json({ cards });
  } catch (error) {
    console.log(error);
  }
};

const contractDetails = async (req, res) => {
  const { search } = req.query;
  try {
    const contract = await Contract.findOne({ contractNo: search })
      .sort("-createdAt")
      .select(
        "contractNo billToAddress billToContact1 billToContact2 billToContact3 shipToAddress shipToContact1 shipToContact2 shipToContact3"
      );
    if (!contract) return res.status(404).json({ msg: "No Contract Found" });

    let billEmail = [],
      shipEmail = [];
    if (contract.billToContact1.email)
      billEmail.push(contract.billToContact1.email);
    if (contract.billToContact2.email)
      billEmail.push(contract.billToContact2.email);
    if (contract.billToContact3.email)
      billEmail.push(contract.billToContact3.email);

    if (contract.shipToContact1.email)
      shipEmail.push(contract.shipToContact1.email);
    if (contract.shipToContact2.email)
      shipEmail.push(contract.shipToContact2.email);
    if (contract.shipToContact3.email)
      shipEmail.push(contract.shipToContact3.email);

    const details = {
      number: contract.contractNo,
      billToName: contract.billToAddress.name,
      billToAddress: `${contract.billToAddress.address1},${contract.billToAddress.address2},${contract.billToAddress.address3},${contract.billToAddress.address4},${contract.billToAddress.nearBy},${contract.billToAddress.city},${contract.billToAddress.pincode}`,
      billToEmails: billEmail,
      shipToName: contract.shipToAddress.name,
      shipToAddress: `${contract.shipToAddress.address1},${contract.shipToAddress.address2},${contract.shipToAddress.address3},${contract.shipToAddress.address4},${contract.shipToAddress.nearBy},${contract.shipToAddress.city},${contract.shipToAddress.pincode}`,
      shipToEmails: shipEmail,
    };

    res.status(200).json({ details });
  } catch (error) {
    console.log(error);
  }
};

const contractServices = async (req, res) => {
  const { search } = req.query;
  try {
    const contracT = await Contract.findOne({ contractNo: search }).sort("-createdAt").populate("services");
    if (!contracT) return res.status(404).json({ msg: "No Contract Found" });

    let billEmail = [], shipEmail = [];
    if (contracT.billToContact1.email)
      billEmail.push(contracT.billToContact1.email);
    if (contracT.billToContact2.email)
      billEmail.push(contracT.billToContact2.email);
    if (contracT.billToContact3.email)
      billEmail.push(contracT.billToContact3.email);
    if (contracT.shipToContact1.email)
      shipEmail.push(contracT.shipToContact1.email);
    if (contracT.shipToContact2.email)
      shipEmail.push(contracT.shipToContact2.email);
    if (contracT.shipToContact3.email)
      shipEmail.push(contracT.shipToContact3.email);

    const details = {
      number: contracT.contractNo,
      billToName: contracT.billToAddress.name,
      billToAddress: `${contracT.billToAddress.address1},${contracT.billToAddress.address2},${contracT.billToAddress.address3},${contracT.billToAddress.address4},${contracT.billToAddress.nearBy},${contracT.billToAddress.city},${contracT.billToAddress.pincode}`,
      billToEmails: billEmail,
      shipToName: contracT.shipToAddress.name,
      shipToAddress: `${contracT.shipToAddress.address1},${contracT.shipToAddress.address2},${contracT.shipToAddress.address3},${contracT.shipToAddress.address4},${contracT.shipToAddress.nearBy},${contracT.shipToAddress.city},${contracT.shipToAddress.pincode}`,
      shipToEmails: shipEmail,
    };

    const serviceArrays = contracT.services.map(({ _id, service, ...rest }) => ({ _id, service }));

    const services = serviceArrays.map(obj => {
      obj.service = obj.service.filter(a => a !== "");
      return { ...obj };
    });

    res.status(200).json({ details, services });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addValues, allValues, serviceCards, contractDetails, contractServices };
