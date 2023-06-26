using Perm_Api.Models;
using System.Collections.Generic;

namespace Perm_Api.Manager
{
    public interface IProjectPricingManager
    {
        List<Project> ProjectsList(string sortingCriteria);
        (List<Rate>, List<Consultant>, List<ExpenseTypeResponse>, List<ServiceTypeResponse>) FetchRates();
        string SaveProjectPricing(ProjectPricingDetails projectPricingDetails);
        ProjectPricingDetails FetchProjectDetailsById(string projectId);
        string SaveRates(List<Rate> rates);
        string SaveService(List<ServiceTypeResponse> serviceTypes);
        string SaveExpense(List<ExpenseTypeResponse> expenseTypes);
        Root FetchSalesForecast();
        (List<Consultant>, List<LeavesDetail>) FetchResourceWork(string userName);
        string ManageLeaves(List<LeavesDetail> leavesDetail,int UserId);
        List<LeavesDetail> FetchLeaves(int userId);
        ResourceQuarterlyAllocation FetchQuarterlyAllocation(int userId);
        ProjectAllocation FetchWeeklyAllocation(int userId);
        void DeletePricing(string projectId);
        ProjectAllocation FetchTeamAllocation();
        void Errors(string message);
        List<ResourceUtlisation> UlitstationByLevels();
    }
}
