using Perm_Api.Models;
using System.Collections.Generic;

namespace Perm_Api.Data
{
    public interface IProjectPricingRepository
    {
        List<Project> ProjectsList(string sortingCriteria);
        (List<Rate>, List<Consultant>, List<ExpenseTypeResponse>, List<ServiceTypeResponse>) FetchRates();
        string SaveProjectPricing(ProjectPricingDetails projectPricingDetails);
        ProjectPricingDetails FetchProjectDetailsById(string projectId);
        string SaveService(List<ServiceTypeResponse> serviceTypes);
        List<LeavesDetail> FetchLeaves(int userId);
        string SaveRates(List<Rate> rates);
        string SaveExpense(List<ExpenseTypeResponse> expenseTypes);
        Root FetchSalesForecast();
        (List<Consultant>, List<LeavesDetail>) FetchResourceWork(string userName);
        ResourceQuarterlyAllocation FetchQuarterlyAllocation(int userId);
        string ManageLeaves(List<LeavesDetail> leavesDetail, int UserId);
        ProjectAllocation FetchWeeklyAllocation(int userId);
        void DeletePricing(string projectId);
        ProjectAllocation FetchTeamAllocation();
        void Errors(string message);
        List<ResourceUtlisation> UlitstationByLevels();
    }
}
