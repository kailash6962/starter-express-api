import { getUserDataByToken } from "../controllers/Auth";
import Invoice from "../models/Invoice";
import InvoiceItems from "../models/InvoiceItems";


export const generateReport = async (req, res) => {
  try {
    var userData = await getUserDataByToken(req);
    var userOrgId = userData.OrgId;
    var userId = userData.UserId;
    var data = req.fields;
    var reportType = data.type;
    var filter = data.filter;

    let obj = {};
      if(filter.fromDate)
      obj.$gte= filter.fromDate;
      if(filter.toDate)
      obj.$lte= filter.toDate;
    if (reportType == 'CustomerBalance') {
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
            key: '$_id',
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
      var overallData = result.reduce(
        (accumulator, currentItem) => {
          accumulator.totalAmountDue += currentItem.amountDue;
          accumulator.totalInvoiceCount += currentItem.invoices.length;
          return accumulator;
        },
        {
          totalAmountDue: 0,
          totalInvoiceCount: 0
        }
      );
    }
    if(reportType == 'ItemSales'){
      var result = await InvoiceItems.aggregate([
        {
          $lookup: {
            from: 'invoices', // The name of the Invoice collection
            localField: 'Invid',
            foreignField: 'Invid',
            as: 'invoiceData',
          },
        },
        {
          $unwind: '$invoiceData', // Unwind the array created by $lookup
        },
        {
          $match: {
            OrgId: userOrgId,
            'invoiceData.InvDate': obj,
          },
        },
        {
          $group: {
            _id: '$prodName',
            totalQuantity: { $sum: '$quantity' },
            totalRevenue: { $sum: '$lineTotal' },
            totalInvoiceCount: { $addToSet: '$Invid' },
            InvCount: { $sum: 1 },
          },
        },
        {
          $sort: { totalQuantity: -1 }
        }
      ])
      var overallData = {};
    }
    if(reportType == 'InvoiceSummary'){
      var result = await Invoice.aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'custCode',
            foreignField: 'Custid',
            as: 'CustomerData',
          },
        },
        {
          $match: {
            OrgId: userOrgId,
            InvDate: obj,
          },
        },
        {
          $sort: { InvDate: -1 }
        },
        {
          $project: {
            _id: 0,
            Adjustment: 1,
            CustomerData: 1,
            Invid: 1,
            InvDate: 1,
            SalesPerson: 1,
            SubTotal: 1,
            TaxValue: 1,
            Discount: 1,
            AmtTotal: 1,
            Status: 1,
          },
        },
      ])
      var overallData = result.reduce(
        (accumulator, currentItem) => {
          accumulator.AmtTotal += currentItem.AmtTotal;
          return accumulator;
        },
        {
          AmtTotal: 0,
        }
      );
      overallData.InvoicesCount = result.length;
    }

    return res.status(200).json({data:result,overallData});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};