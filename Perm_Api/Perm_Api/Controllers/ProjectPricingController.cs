
using Perm_Api.Manager;
using Perm_Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Perm_Api.Controllers
{
    [RoutePrefix("ProjectPricing")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProjectPricingController : ApiController
    {
        private readonly IProjectPricingManager _projectPricingManager;
        static bool isProd =Convert.ToBoolean(WebConfigurationManager.AppSettings["isProd"]);

        public ProjectPricingController()
        {

        }

        public ProjectPricingController(IProjectPricingManager projectPricingManager)
        {
            this._projectPricingManager = projectPricingManager;
        }


        [HttpGet]
        [Route("ProjectsList/{sortingCriteria}")]
        public HttpResponseMessage ProjectsList(string sortingCriteria = "CreatedDate")
        {
            try
            {
                var projectList = _projectPricingManager.ProjectsList(sortingCriteria);
                return Request.CreateResponse(HttpStatusCode.OK, projectList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("PricingFiles/{UserName}")]
        public HttpResponseMessage PricingFiles(string UserName)
        {
            try
            {
                string sortingCriteria = "CreatedDate";
                var projectList = _projectPricingManager.ProjectsList(sortingCriteria);
                var pricingList = projectList.Where(x => x.LevantLead.Equals(UserName)).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, pricingList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("FetchResourceWork/{UserName}")]
        public HttpResponseMessage FetchResourceWork(string UserName)
        {
            try
            {
                var resourceWork = _projectPricingManager.FetchResourceWork(UserName);
                return Request.CreateResponse(HttpStatusCode.OK, resourceWork);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }



        [HttpGet]
        [Route("ProjectsList/{sortingCriteria}/{searchText}")]
        public HttpResponseMessage ProjectsList(string sortingCriteria = "CreatedDate", string searchText = "")
        {
            try
         {
                var projectList = _projectPricingManager.ProjectsList(sortingCriteria);
                if (!string.IsNullOrEmpty(searchText))
                {
                    projectList = projectList.Where(x => x.ClientName.ToLower().Contains(searchText.ToLower()) || x.ProjectName.ToLower().Contains(searchText.ToLower())
                                                    || x.Location.ToLower().Contains(searchText.ToLower()) || x.Status.ToLower().Contains(searchText.ToLower())
                                                    || x.ProjectStartDate.ToLower().Contains(searchText.ToLower()) || x.ProjectEndDate.ToLower().Contains(searchText.ToLower())
                                                    || x.LevantLead.ToLower().Contains(searchText.ToLower()) || x.TotalRevenue.ToString().ToLower().Contains(searchText.ToLower())).ToList();
                }
                return Request.CreateResponse(HttpStatusCode.OK, projectList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("FetchProjectDetailsById/{projectId}")]
        public HttpResponseMessage FetchProjectDetailsById(string projectId)
        {
            try
            {
                var projectList = _projectPricingManager.FetchProjectDetailsById(projectId);
                return Request.CreateResponse(HttpStatusCode.OK, projectList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("Rates")]
        public HttpResponseMessage Rates()
        {
            try
            {
                var rates = _projectPricingManager.FetchRates();
                return Request.CreateResponse(HttpStatusCode.OK, rates);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("FetchSalesForecast")]
        public HttpResponseMessage FetchSalesForecast()
        {
            try
            {
                var salesForecastData = _projectPricingManager.FetchSalesForecast();
                return Request.CreateResponse(HttpStatusCode.OK, salesForecastData);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }


        [HttpGet]
        [Route("FetchQuarterlyAllocation/{UserId}")]
        public HttpResponseMessage FetchQuarterlyAllocation(int UserId)
        {
            try
            {
                var workAllocation = _projectPricingManager.FetchQuarterlyAllocation(UserId);
                return Request.CreateResponse(HttpStatusCode.OK, workAllocation);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("FetchWeeklyAllocation/{UserId}")]
        public HttpResponseMessage FetchWeeklyAllocation(int userId)
        {
            try
            {
                var resWeeklyAllocation = _projectPricingManager.FetchWeeklyAllocation(userId);
                return Request.CreateResponse(HttpStatusCode.OK, resWeeklyAllocation);
            }
            catch (Exception ex)
            {
                _projectPricingManager.Errors(ex.Message);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("FetchTeamAllocation")]
        public HttpResponseMessage FetchTeamAllocation()
        {
            try
            {
                var teamsAllocation = _projectPricingManager.FetchTeamAllocation();
                return Request.CreateResponse(HttpStatusCode.OK, teamsAllocation);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("UlitstationByLevels")]
        public HttpResponseMessage UlitstationByLevels()
        {
            try
            {
                var resourceUtlisation = _projectPricingManager.UlitstationByLevels();
                return Request.CreateResponse(HttpStatusCode.OK, resourceUtlisation);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("SaveProjectPricing")]
        public HttpResponseMessage SaveProjectPricing(ProjectPricingDetails projectPricingDetails)
        {
            try
            {
                string status = _projectPricingManager.SaveProjectPricing(projectPricingDetails);
                return Request.CreateResponse(HttpStatusCode.OK,status);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("DeletePricing/{projectId}")]
        public HttpResponseMessage DeletePricing(string projectId)
        {
            try
            {
                _projectPricingManager.DeletePricing(projectId);
                var projectList = _projectPricingManager.ProjectsList(string.Empty);
                return Request.CreateResponse(HttpStatusCode.OK, projectList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("SaveRates")]
        public HttpResponseMessage SaveRates(List<Rate> rates)
        {
            try
            {
                string ratesResponse = _projectPricingManager.SaveRates(rates);
                return Request.CreateResponse(HttpStatusCode.OK, rates);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("SaveService")]
        public HttpResponseMessage SaveService(List<ServiceTypeResponse> serviceTypes)
        {
            try
            {
                string serviceTypesResponse = _projectPricingManager.SaveService(serviceTypes);
                return Request.CreateResponse(HttpStatusCode.OK, serviceTypesResponse);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("SaveExpense")]
        public HttpResponseMessage SaveExpense(List<ExpenseTypeResponse> expenseTypes)
        {
            try
            {
                string expense = _projectPricingManager.SaveExpense(expenseTypes);
                return Request.CreateResponse(HttpStatusCode.OK, expenseTypes);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpPost]
        [Route("manageLeaves/{UserId}")]
        public HttpResponseMessage ManageLeaves(List<LeavesDetail> leavesDetail,int UserId)
        {
            try
            {
                string serviceTypesResponse = _projectPricingManager.ManageLeaves(leavesDetail, UserId);
                return Request.CreateResponse(HttpStatusCode.OK, serviceTypesResponse);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("FetchLeaves/{userId}")]
        public HttpResponseMessage FetchLeaves(int userId)
        {
            try
            {
                var leaves = _projectPricingManager.FetchLeaves(userId);
                return Request.CreateResponse(HttpStatusCode.OK, leaves);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex);
            }
        }





    }
}
