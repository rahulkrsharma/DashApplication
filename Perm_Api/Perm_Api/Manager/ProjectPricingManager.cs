using Perm_Api.Data;
using Perm_Api.Models;
using System;
using System.Collections.Generic;

namespace Perm_Api.Manager
{
    public class ProjectPricingManager : IProjectPricingManager
    {
        private readonly IProjectPricingRepository projectPricingRepository;

        public ProjectPricingManager(IProjectPricingRepository projectPricingRepository)
        {
            this.projectPricingRepository = projectPricingRepository;
        }

        public List<LeavesDetail> FetchLeaves(int userId)
        {
            return projectPricingRepository.FetchLeaves(userId);
        }

        public ProjectPricingDetails FetchProjectDetailsById(string projectId)
        {
            return projectPricingRepository.FetchProjectDetailsById(projectId);
        }

        public ResourceQuarterlyAllocation FetchQuarterlyAllocation(int userId)
        {
             return projectPricingRepository.FetchQuarterlyAllocation(userId);
        }

        public (List<Rate>, List<Consultant>, List<ExpenseTypeResponse>, List<ServiceTypeResponse>) FetchRates()
        {
            return projectPricingRepository.FetchRates();
        }

        public (List<Consultant>, List<LeavesDetail>) FetchResourceWork(string userName)
        {
            return projectPricingRepository.FetchResourceWork(userName);
        }
            

        public Root FetchSalesForecast()
        {
            return projectPricingRepository.FetchSalesForecast();
        }

        public string ManageLeaves(List<LeavesDetail> leavesDetail,int UserId)
        {
            return projectPricingRepository.ManageLeaves(leavesDetail,UserId);
        }

        public List<Project> ProjectsList(string sortingCriteria)
        {
            return projectPricingRepository.ProjectsList(sortingCriteria);
        }

        public string SaveExpense(List<ExpenseTypeResponse> expenseTypes)
        {
            return projectPricingRepository.SaveExpense(expenseTypes);
        }

        public string SaveProjectPricing(ProjectPricingDetails projectPricingDetails)
        {
            return projectPricingRepository.SaveProjectPricing(projectPricingDetails);
        }

        public string SaveRates(List<Rate> rates)
        {
            return projectPricingRepository.SaveRates(rates);
        }

        public string SaveService(List<ServiceTypeResponse> serviceTypes)
        {
            return projectPricingRepository.SaveService(serviceTypes);
        }

        public ProjectAllocation FetchWeeklyAllocation(int userId)
        {
            return projectPricingRepository.FetchWeeklyAllocation(userId);
        }

        public void DeletePricing(string projectId)
        {
            projectPricingRepository.DeletePricing(projectId);
        }

        public ProjectAllocation FetchTeamAllocation()
        {
            return projectPricingRepository.FetchTeamAllocation();
        }

        public void Errors(string message)
        {
            projectPricingRepository.Errors(message);
        }

        public List<ResourceUtlisation> UlitstationByLevels()
        {
            return projectPricingRepository.UlitstationByLevels();
        }
    }
}