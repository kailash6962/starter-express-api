import { getUserDataByToken } from "../controllers/Auth";
import Invoice from "../models/Invoice";


export const generateReport = async (req, res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    var data = req.fields;
    var reportType = data.type;
    var filter = data.filter;
    if (reportType == 'CustomerBalance') {
      let obj = {};
      if(filter.fromDate)
      obj.$gte= filter.fromDate;
      if(filter.toDate)
      obj.$lte= filter.toDate;
      var result = await Invoice.aggregate([
        {
          $match: {
            Status: { $ne: 'FullyPaid' },
            DueDate: obj,
            OrgId: userOrgId
          },
        },
        {
          $project: {
            custCode: 1,
            amountDue: { $subtract: ['$AmtTotal', '$AmtPaid'] },
            Invid: '$Invid',
            AmtTotal: '$AmtTotal',
            AmtPaid: '$AmtPaid',
            DueDate: '$DueDate',
          },
        },
        {
          $group: {
            _id: '$custCode',
            amountDue: { $sum: '$amountDue' },
            invoiceNumbers: { $push: '$Invid' },
            invoices: {
              $push: {
                invoiceNumbers: '$Invid',
                DueDate: '$DueDate',
                AmtTotal: '$AmtTotal',
                pendingAmt: { $subtract: [{ $toDouble: '$AmtTotal' }, { $toDouble: '$AmtPaid' }] },
              },
            },
          },
        },
        {
          $lookup:
          {
            from: 'customers',
            localField: '_id',
            foreignField: 'Custid',
            "pipeline": [
              { "$match": { "OrgId": userOrgId } },
            ],
            as: 'CustomerData'
          }
        },
        {
          $project: {
            _id: 0,
            custCode: '$_id',
            amountDue: 1,
            invoices: 1,
            customerName: { $arrayElemAt: ['$CustomerData.custName', 0] },
            customerEmail: { $arrayElemAt: ['$CustomerData.email', 0] },
            customerMobile: { $arrayElemAt: ['$CustomerData.mobile', 0] },
            creditLimit: { $arrayElemAt: ['$CustomerData.creditLimit', 0] },
          },
        },
      ])
    }
    return res.status(200).json({data:result});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};