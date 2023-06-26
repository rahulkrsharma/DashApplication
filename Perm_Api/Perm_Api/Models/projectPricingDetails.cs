using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Perm_Api.Models
{
    public class ProjectPricingDetails
    {
        public ProjectDetails ProjectDetails;
        public List<PriceQuote> PriceQuote;
        public List<ExpenseQuote> ExpenseQuote;

    }

    public class ProjectDetails
    {
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }

        public string ClientName { get; set; }

        public string Location { get; set; }

        public string Stage { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string ServiceType { get; set; }

        public string SalesLead { get; set; }

        public string EngagementLead { get; set; }

        public string DeliveryLead { get; set; }

        public string CreatedDate { get; set; }

        public List<ServiceTypeResponse> SelectedServiceTypes;

        public decimal? TotalRevenue { get; set; }
        public decimal? TotalCost { get; set; }
        public decimal? TotalExpenseValue { get; set; }
        public decimal? TotalProfitabilityCost { get; set; }
        public decimal? TotalProfitPercent { get; set; }

        public string Resource { get; set; }

    }

    public class SalesForecast
    {
        public string MonthName { get; set; }
        public string ProjectStage { get; set; }
        public decimal? TotalMonthlyRevenue { get; set; }

    }

    public class SupplyLevel
    {
        public int? WeeklySupply { get; set; }
        public string level { get; set; }
    }

    public class QuarterlyAllocation
    {
        public decimal? TotalMonthlyWorkDays { get; set; }
        public string MonthName { get; set; }

    }

    public class LeaveAllocation
    {
        public int? TotalMonthlyWorkDays { get; set; }
        public string MonthName { get; set; }

    }

    public class ProjectAllocation
    {
        public List<WeeklyAllocation> teamsAllocations {get;set;}

        public Dictionary<string,string> projectWithStage { get; set; }
    }

    public class ResourceUtlisation
    {
        public int RepeatCount { get; set; }
        public string SupplyOrDemand { get; set; }
        public string Level { get; set; }
        public string Week1 { get; set; }
        public string Week2 { get; set; }
        public string Week3 { get; set; }
        public string Week4 { get; set; }
        public string Week5 { get; set; }
        public string Week6 { get; set; }
        public string Week7 { get; set; }
        public string Week8 { get; set; }
        public string Week9 { get; set; }
        public string Week10 { get; set; }
        public string Week11 { get; set; }
        public string Week12 { get; set; }
        public int RowSpan { get; set; }
    }

    public class WeeklyAllocation
    {
        public int RepeatCount { get; set; }
        public string consultant { get; set; }
        public string profileUrl { get; set; }
        public string Week1 { get; set; }
        public string Week2 { get; set; }
        public string Week3 { get; set; }
        public string Week4 { get; set; }
        public string Week5 { get; set; }
        public string Week6 { get; set; }
        public string Week7 { get; set; }
        public string Week8 { get; set; }
        public string Week9 { get; set; }
        public string Week10 { get; set; }
        public string Week11 { get; set; }
        public string Week12 { get; set; }
        public int RowSpan { get; set; }
    }

    public class ResourceQuarterlyAllocation
    {
        public decimal? currentQuarterSum { get; set; }
        public decimal? previousQuarterSum { get; set; }

        public decimal? nextQuarterSum { get; set; }

        public decimal? currentQuarterLeaveSum { get; set; }

        public decimal? previousQuarterLeaveSum { get; set; }

        public decimal? nextQuarterLeaveSum { get; set; }

        public decimal? currentQuarterPercentAllocation { get; set; }

        public decimal? previousQuarterPercentAllocation { get; set; }

        public decimal? nextQuarterPercentAllocation { get; set; }

    }

    public class ServiceType
    {
        public string project_id { get; set; }
        public string code { get; set; }
        public string name { get; set; }

    }

    public class ServiceTypeResponse
    {
        public int? UserId { get; set; }
        public string ServiceType { get; set; }
        public string ServiceDescription { get; set; }

    }

    public class LeavesDetail
    {
        public string UserName { get; set; }
        public int? UserId { get; set; }
        public int? Duration { get; set; }
        public string LeaveType { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Reason { get; set; }

    }



    public class ExpenseTypeResponse
    {
        public string ExpenseType { get; set; }
        public string ExpenseDescription { get; set; }

    }

    public class PriceQuote
    {
        public string ProjectRole { get; set; }

        public string Level { get; set; }

        public string Consultant { get; set; }

        public decimal? RackRate { get; set; }

        public decimal? CostRate { get; set; }

        public string Billable { get; set; }

        public decimal? AppliedRate { get; set; }

        public decimal? Discount { get; set; }

        public string ContractType { get; set; }

        public decimal? LevantCost { get; set; }

        public decimal? TotalCost { get; set; }

        public decimal? ClientRate { get; set; }

        public decimal? ContractPercent { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public int? Capacity { get; set; }

        public decimal? Subtotal { get; set; }

        public decimal? DeliveryCost { get; set; }

        public decimal? CostToSell { get; set; }

        public decimal? TotalDiscount { get; set; }

        public decimal? GrossProfit { get; set; }

        public decimal? WorkingDays { get; set; }

        public int? ActualWorkingDays { get; set; }
    }

    public class ExpenseQuote
    {
        public string ExpenseType { get; set; }

        public string Description { get; set; }

        public int? Number { get; set; }

        public decimal? UnitCost { get; set; }

        public int? Billable { get; set; }

        public decimal? LevantCost { get; set; }

        public decimal? ClientCost { get; set; }

        public decimal? Subtotal { get; set; }
    }

    public class Dataset
    {
        public string label { get; set; }
        public string borderColor { get; set; }
        public string backgroundColor { get; set; }
        public List<decimal?> data { get; set; }
        public int borderWidth { get; set; }
    }

    public class Root
    {
        public List<string> labels { get; set; }
        public List<Dataset> datasets { get; set; }
        public decimal? MaxValue { get; set; }
    }
}