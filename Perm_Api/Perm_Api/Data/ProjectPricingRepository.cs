using Perm_Api.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Perm_Api.Data
{
    public class ProjectPricingRepository : IProjectPricingRepository
    {
        SqlConnection con = new SqlConnection(@"Data Source = dash.crbxbf5fbyts.us-east-1.rds.amazonaws.com,1433; Initial Catalog = Dashdb;User Id=admin;Password=Bico12345;");
        SqlConnection tempcon = new SqlConnection(@"Data Source = dash.crbxbf5fbyts.us-east-1.rds.amazonaws.com,1433; Initial Catalog = Dashdb;User Id=admin;Password=Bico12345;");

        public (List<Rate>, List<Consultant>, List<ExpenseTypeResponse>, List<ServiceTypeResponse>) FetchRates()
        {
            var rates = new List<Rate>();
            var consultants = new List<Consultant>();
            var expenseTypes = new List<ExpenseTypeResponse>();
            var serviceTypes = new List<ServiceTypeResponse>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spGetRate", con);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var rate = new Rate
                    {
                        LevelId = dr["LevelId"] as int?,
                        Level = dr["Level"] as string,
                        RackRate = dr["RackRate"] as decimal?,
                        CostRate = dr["CostRate"] as decimal?
                    };
                    rates.Add(rate);
                }

                dr.NextResult();

                while (dr.Read())
                {
                    var consultant = new Consultant
                    {
                        ConsultantId = dr["ConsultantId"] as int?,
                        UserName = dr["UserName"] as string,
                        UserEmail = dr["UserEmail"] as string,
                        ConsultantWorkdays = dr["ConsultantWorkdays"] as int?
                    };
                    consultants.Add(consultant);
                }

                dr.NextResult();

                while (dr.Read())
                {
                    var expenseType = new ExpenseTypeResponse
                    {
                        ExpenseType = dr["ExpenseType"] as string,
                        ExpenseDescription = dr["ExpenseDescription"] as string,
                    };
                    expenseTypes.Add(expenseType);
                }

                dr.NextResult();

                while (dr.Read())
                {
                    var serviceType = new ServiceTypeResponse
                    {
                        ServiceType = dr["ServiceType"] as string,
                        ServiceDescription = dr["ServiceDescription"] as string,
                    };
                    serviceTypes.Add(serviceType);
                }

                return (rates, consultants, expenseTypes, serviceTypes);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        public List<Project> ProjectsList(string sortingCriteria)
        {
            var projects = new List<Project>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spListProjects", con);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var project = new Project
                    {
                        ProjectId = dr["ProjectId"] as string,
                        ClientName = dr["ClientName"] as string,
                        ProjectURL = dr["ProjectURL"] as string,
                        ProjectName = dr["ProjectName"] as string,
                        Status = dr["Status"] as string,
                        ServiceOffering = dr["ServiceOffering"] as string,
                        LevantLead = dr["LevantLead"] as string,
                        TotalRevenue = dr["TotalRevenue"] as decimal?,
                        Location = dr["Location"] as string,
                        Country = dr["Country"] as string,
                        ProjectStartDate = dr["ProjectStartDate"] as string,
                        ProjectEndDate = dr["ProjectEndDate"] as string,
                        CreatedDate = dr["CreatedDate"] as string
                    };
                    projects.Add(project);
                }
                var sortedList = ApplySorting(projects, sortingCriteria);

                return sortedList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }


        public string SaveProjectPricing(ProjectPricingDetails projectPricingDetails)
        {
            con.Open();
            try
            {
                int result;
                string projectId = string.Empty;
                if (!string.IsNullOrEmpty(projectPricingDetails.ProjectDetails.ProjectId))
                {
                    projectId = projectPricingDetails.ProjectDetails.ProjectId;
                    DeleteExistingRecordBeforeUpdating(projectId);
                }
                else
                {
                    Random r = new Random();
                    Guid projId = Guid.NewGuid();
                    projectId = projId.ToString();
                }

                SaveProjectDetails(projectId.ToString(), projectPricingDetails);
                SaveResourceEstimate(projectId.ToString(), projectPricingDetails);
                SaveExpenseEstimate(projectId.ToString(), projectPricingDetails);
                return "Saved";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        private void DeleteExistingRecordBeforeUpdating(string projectId)
        {
            string resourceEstimateQuery = "DELETE from ResourceEstimate Where project_id = @projectId";
            SqlCommand myCommand2 = new SqlCommand(resourceEstimateQuery, con);
            myCommand2.Parameters.AddWithValue("@projectId", projectId);
            myCommand2.ExecuteNonQuery();


            string selectedServiceQuery = "DELETE from SelectedServiceType Where project_id = @projectId";
            SqlCommand myCommand1 = new SqlCommand(selectedServiceQuery, con);
            myCommand1.Parameters.AddWithValue("@projectId", projectId);
            myCommand1.ExecuteNonQuery();

           

            string expenseEstimateQuery = "DELETE from ExpenseEstimate Where project_id = @projectId";
            SqlCommand myCommand3 = new SqlCommand(expenseEstimateQuery, con);
            myCommand3.Parameters.AddWithValue("@projectId", projectId);
            myCommand3.ExecuteNonQuery();

            string projectDetailsQuery = "DELETE from ProjectDetails Where project_id = @projectId";
            SqlCommand myCommand = new SqlCommand(projectDetailsQuery, con);
            myCommand.Parameters.AddWithValue("@projectId", projectId);
            myCommand.ExecuteNonQuery();
        }

        private List<Project> ApplySorting(List<Project> projects, string sortingCriteria)
        {
            var sortedList = new List<Project>();
            switch (sortingCriteria)
            {
                case "CreatedDate":
                    sortedList = projects.OrderByDescending(x => x.CreatedDate).ToList();
                    break;
                case "ClientName":
                    sortedList = projects.OrderBy(x => x.ClientName).ToList();
                    break;
                case "ProjectName":
                    sortedList = projects.OrderBy(x => x.ProjectName).ToList();
                    break;
                case "status":
                    sortedList = projects.OrderBy(x => x.Status).ToList();
                    break;
                case "ServiceOffering":
                    sortedList = projects.OrderBy(x => x.ServiceOffering).ToList();
                    break;
                case "LevantLead":
                    sortedList = projects.OrderBy(x => x.LevantLead).ToList();
                    break;
                case "Location":
                    sortedList = projects.OrderBy(x => x.Location).ToList();
                    break;
                case "StartDate":
                    sortedList = projects.OrderBy(x => x.ProjectStartDate).ToList();
                    break;
                case "Status":
                    sortedList = projects.OrderBy(x => x.Status).ToList();
                    break;
                default:
                    sortedList = projects.OrderBy(x => x.ClientName).ToList();
                    break;
            }
            return sortedList;

        }

        private void SaveProjectDetails(string projectId, ProjectPricingDetails projectPricingDetails)
        {
            string projectDetailsQuery = "INSERT INTO ProjectDetails (project_id, project_name, client_name, location, project_stage,  project_start_date, project_end_date, sales_lead, engagement_lead, delivery_lead,created_date,total_revenue,total_cost,total_expense,total_profitability,total_profit)";
            projectDetailsQuery += " VALUES (@projectId,@project_name,@client_name,@location,@project_stage,@project_start_date,@project_end_date,@sales_lead,@engagement_lead,@delivery_lead,@created_date,@total_revenue,@total_cost,@total_expense,@total_profitability,@total_profit)";

            SqlCommand myCommand = new SqlCommand(projectDetailsQuery, con);
            myCommand.Parameters.AddWithValue("@projectId", projectId);
            myCommand.Parameters.AddWithValue("@project_name", projectPricingDetails.ProjectDetails.ProjectName);
            myCommand.Parameters.AddWithValue("@client_name", projectPricingDetails.ProjectDetails.ClientName);
            myCommand.Parameters.AddWithValue("@location", projectPricingDetails.ProjectDetails.Location);
            myCommand.Parameters.AddWithValue("@project_stage", projectPricingDetails.ProjectDetails.Stage);
            myCommand.Parameters.AddWithValue("@project_start_date", projectPricingDetails.ProjectDetails.StartDate);
            myCommand.Parameters.AddWithValue("@project_end_date", projectPricingDetails.ProjectDetails.EndDate);
            myCommand.Parameters.AddWithValue("@sales_lead", projectPricingDetails.ProjectDetails.SalesLead);
            myCommand.Parameters.AddWithValue("@engagement_lead", projectPricingDetails.ProjectDetails.EngagementLead);
            myCommand.Parameters.AddWithValue("@delivery_lead", projectPricingDetails.ProjectDetails.DeliveryLead);
            myCommand.Parameters.AddWithValue("@created_date", DateTime.Now);
            myCommand.Parameters.AddWithValue("@total_revenue", projectPricingDetails.ProjectDetails.TotalRevenue);
            myCommand.Parameters.AddWithValue("@total_cost", projectPricingDetails.ProjectDetails.TotalCost);
            myCommand.Parameters.AddWithValue("@total_expense", projectPricingDetails.ProjectDetails.TotalExpenseValue);
            myCommand.Parameters.AddWithValue("@total_profitability", projectPricingDetails.ProjectDetails.TotalProfitPercent);
            myCommand.Parameters.AddWithValue("@total_profit", projectPricingDetails.ProjectDetails.TotalProfitabilityCost);
            myCommand.ExecuteNonQuery();

            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn("project_id", typeof(string)));
            dt.Columns.Add(new DataColumn("code", typeof(string)));
            dt.Columns.Add(new DataColumn("name", typeof(string)));
            for (int i = 0; i < projectPricingDetails.ProjectDetails.SelectedServiceTypes.Count; i++)
            {
                dt.Rows.Add(projectId, projectPricingDetails.ProjectDetails.SelectedServiceTypes[i].ServiceType, projectPricingDetails.ProjectDetails.SelectedServiceTypes[i].ServiceDescription);
            }
            SqlBulkCopy expenseBulkCopy = new SqlBulkCopy(con);

            expenseBulkCopy.DestinationTableName = "SelectedServiceType";
            expenseBulkCopy.ColumnMappings.Add("project_id", "project_id");
            expenseBulkCopy.ColumnMappings.Add("code", "code");
            expenseBulkCopy.ColumnMappings.Add("name", "name");
            expenseBulkCopy.WriteToServer(dt);
        }

        public void Errors(string errorMessage)
        {
            try
            {
                con.Open();
                string errorQuery = "INSERT INTO Errors (error_description, created_date)";
                errorQuery += " VALUES (@error_description,@created_date)";

                SqlCommand errorCommand = new SqlCommand(errorQuery, con);
                errorCommand.Parameters.AddWithValue("@error_description", errorMessage);
                errorCommand.Parameters.AddWithValue("@created_date", DateTime.Now.ToString());
                errorCommand.ExecuteNonQuery();
            }
            catch(Exception ex)
            {

            }
            finally
            {
                con.Close();
            }
        }

        private void SaveResourceEstimate(string projectId, ProjectPricingDetails projectPricingDetails)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn("project_id", typeof(string)));
            dt.Columns.Add(new DataColumn("project_role", typeof(string)));
            dt.Columns.Add(new DataColumn("level", typeof(string)));
            dt.Columns.Add(new DataColumn("consultant", typeof(string)));
            dt.Columns.Add(new DataColumn("billable", typeof(string)));
            dt.Columns.Add(new DataColumn("applied_rate", typeof(decimal)));
            dt.Columns.Add(new DataColumn("client_rate", typeof(decimal)));
            dt.Columns.Add(new DataColumn("contract_type", typeof(string)));
            dt.Columns.Add(new DataColumn("levant_cost", typeof(decimal)));
            dt.Columns.Add(new DataColumn("start_date", typeof(string)));
            dt.Columns.Add(new DataColumn("end_date", typeof(string)));
            dt.Columns.Add(new DataColumn("capacity", typeof(int)));
            dt.Columns.Add(new DataColumn("rack_rate", typeof(decimal)));
            dt.Columns.Add(new DataColumn("cost_rate", typeof(decimal)));
            dt.Columns.Add(new DataColumn("discount", typeof(decimal)));
            dt.Columns.Add(new DataColumn("total_cost", typeof(decimal)));
            dt.Columns.Add(new DataColumn("contract_percent", typeof(decimal)));
            dt.Columns.Add(new DataColumn("sub_total", typeof(decimal)));
            dt.Columns.Add(new DataColumn("delivery_cost", typeof(decimal)));
            dt.Columns.Add(new DataColumn("cost_tosell", typeof(decimal)));
            dt.Columns.Add(new DataColumn("total_discount", typeof(decimal)));
            dt.Columns.Add(new DataColumn("gross_profit", typeof(decimal)));
            dt.Columns.Add(new DataColumn("working_days", typeof(decimal)));
            dt.Columns.Add(new DataColumn("ActualWorkingDays", typeof(decimal)));
            for (int i = 0; i < projectPricingDetails.PriceQuote.Count; i++)
            {
                dt.Rows.Add(projectId, projectPricingDetails.PriceQuote[i].ProjectRole, projectPricingDetails.PriceQuote[i].Level, projectPricingDetails.PriceQuote[i].Consultant, projectPricingDetails.PriceQuote[i].Billable, projectPricingDetails.PriceQuote[i].AppliedRate, projectPricingDetails.PriceQuote[i].ClientRate,
                projectPricingDetails.PriceQuote[i].ContractType, projectPricingDetails.PriceQuote[i].LevantCost, projectPricingDetails.PriceQuote[i].StartDate, projectPricingDetails.PriceQuote[i].EndDate, projectPricingDetails.PriceQuote[i].Capacity,
                projectPricingDetails.PriceQuote[i].RackRate, projectPricingDetails.PriceQuote[i].CostRate, projectPricingDetails.PriceQuote[i].Discount, projectPricingDetails.PriceQuote[i].TotalCost, projectPricingDetails.PriceQuote[i].ContractPercent, projectPricingDetails.PriceQuote[i].Subtotal,
                projectPricingDetails.PriceQuote[i].DeliveryCost, projectPricingDetails.PriceQuote[i].CostToSell, projectPricingDetails.PriceQuote[i].TotalDiscount, projectPricingDetails.PriceQuote[i].GrossProfit, projectPricingDetails.PriceQuote[i].WorkingDays, projectPricingDetails.PriceQuote[i].ActualWorkingDays);
            }
            SqlBulkCopy expenseBulkCopy = new SqlBulkCopy(con);

            expenseBulkCopy.DestinationTableName = "ResourceEstimate";
            expenseBulkCopy.ColumnMappings.Add("project_id", "project_id");
            expenseBulkCopy.ColumnMappings.Add("project_role", "project_role");
            expenseBulkCopy.ColumnMappings.Add("level", "level");
            expenseBulkCopy.ColumnMappings.Add("consultant", "consultant");
            expenseBulkCopy.ColumnMappings.Add("billable", "billable");
            expenseBulkCopy.ColumnMappings.Add("applied_rate", "applied_rate");
            expenseBulkCopy.ColumnMappings.Add("contract_type", "contract_type");
            expenseBulkCopy.ColumnMappings.Add("levant_cost", "levant_cost");
            expenseBulkCopy.ColumnMappings.Add("start_date", "start_date");
            expenseBulkCopy.ColumnMappings.Add("end_date", "end_date");
            expenseBulkCopy.ColumnMappings.Add("client_rate", "client_rate");
            expenseBulkCopy.ColumnMappings.Add("capacity", "capacity");
            expenseBulkCopy.ColumnMappings.Add("rack_rate", "rack_rate");
            expenseBulkCopy.ColumnMappings.Add("cost_rate", "cost_rate");
            expenseBulkCopy.ColumnMappings.Add("discount", "discount");
            expenseBulkCopy.ColumnMappings.Add("total_cost", "total_cost");
            expenseBulkCopy.ColumnMappings.Add("contract_percent", "contract_percent");
            expenseBulkCopy.ColumnMappings.Add("sub_total", "sub_total");
            expenseBulkCopy.ColumnMappings.Add("delivery_cost", "delivery_cost");
            expenseBulkCopy.ColumnMappings.Add("cost_tosell", "cost_tosell");
            expenseBulkCopy.ColumnMappings.Add("total_discount", "total_discount");
            expenseBulkCopy.ColumnMappings.Add("gross_profit", "gross_profit");
            expenseBulkCopy.ColumnMappings.Add("working_days", "working_days");
            expenseBulkCopy.ColumnMappings.Add("ActualWorkingDays", "ActualWorkingDays");
            expenseBulkCopy.WriteToServer(dt);
        }

        private void SaveExpenseEstimate(string projectId, ProjectPricingDetails projectPricingDetails)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add(new DataColumn("project_id", typeof(string)));
            dt.Columns.Add(new DataColumn("expense_type", typeof(string)));
            dt.Columns.Add(new DataColumn("expense_description", typeof(string)));
            dt.Columns.Add(new DataColumn("billable_percent", typeof(int)));
            dt.Columns.Add(new DataColumn("unit_cost", typeof(int)));
            dt.Columns.Add(new DataColumn("quantity", typeof(int)));
            dt.Columns.Add(new DataColumn("levant_cost", typeof(int)));
            dt.Columns.Add(new DataColumn("client_cost", typeof(int)));
            dt.Columns.Add(new DataColumn("subtotal", typeof(int)));
            for (int i = 0; i < projectPricingDetails.ExpenseQuote.Count; i++)
            {
                dt.Rows.Add(projectId, projectPricingDetails.ExpenseQuote[i].ExpenseType, projectPricingDetails.ExpenseQuote[i].Description, projectPricingDetails.ExpenseQuote[i].Billable, projectPricingDetails.ExpenseQuote[i].UnitCost, projectPricingDetails.ExpenseQuote[i].Number, projectPricingDetails.ExpenseQuote[i].LevantCost, projectPricingDetails.ExpenseQuote[i].ClientCost, projectPricingDetails.ExpenseQuote[i].Subtotal);
            }
            SqlBulkCopy expenseBulkCopy = new SqlBulkCopy(con);

            expenseBulkCopy.DestinationTableName = "ExpenseEstimate";
            expenseBulkCopy.ColumnMappings.Add("project_id", "project_id");
            expenseBulkCopy.ColumnMappings.Add("expense_type", "expense_type");
            expenseBulkCopy.ColumnMappings.Add("expense_description", "expense_description");
            expenseBulkCopy.ColumnMappings.Add("billable_percent", "billable_percent");
            expenseBulkCopy.ColumnMappings.Add("unit_cost", "unit_cost");
            expenseBulkCopy.ColumnMappings.Add("quantity", "quantity");
            expenseBulkCopy.ColumnMappings.Add("levant_cost", "levant_cost");
            expenseBulkCopy.ColumnMappings.Add("client_cost", "client_cost");
            expenseBulkCopy.ColumnMappings.Add("subtotal", "subtotal");

            expenseBulkCopy.WriteToServer(dt);
        }

        public ProjectPricingDetails FetchProjectDetailsById(string projectId)
        {
            var projectPricingDetails = new ProjectPricingDetails();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("FetchProjectDetailsById", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@projectId", projectId);
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var projectDetails = new ProjectDetails()
                    {
                        ProjectName = dr["ProjectName"] as string,
                        ClientName = dr["ClientName"] as string,
                        Stage = dr["Stage"] as string,
                        StartDate = dr["StartDate"] as string,
                        EndDate = dr["EndDate"] as string,
                        ServiceType = dr["ServiceType"] as string,
                        Location = dr["Location"] as string,
                        SalesLead = dr["SalesLead"] as string,
                        EngagementLead = dr["EngagementLead"] as string,
                        DeliveryLead = dr["DeliveryLead"] as string,
                    };
                    projectPricingDetails.ProjectDetails = projectDetails;
                }

                dr.NextResult();

                var selectedServiceType = new List<ServiceTypeResponse>();
                while (dr.Read())
                {
                    var serviceType = new ServiceTypeResponse()
                    {
                        ServiceType = dr["ServiceType"] as string,
                        ServiceDescription = dr["ServiceDescription"] as string,
                    };
                    selectedServiceType.Add(serviceType);
                }
                if (projectPricingDetails.ProjectDetails != null)
                {
                    projectPricingDetails.ProjectDetails.SelectedServiceTypes = selectedServiceType;
                }


                dr.NextResult();

                var resourceEstimate = new List<PriceQuote>();
                while (dr.Read())
                {
                    var resEst = new PriceQuote()
                    {

                        ProjectRole = dr["ProjectRole"] as string,
                        Level = dr["Level"] as string,
                        Consultant = dr["Consultant"] as string,
                        Billable = dr["Billable"] as string,
                        AppliedRate = dr["AppliedRate"] as decimal?,
                        ContractType = dr["ContractType"] as string,
                        LevantCost = dr["LevantCost"] as decimal?,
                        ClientRate = dr["ClientRate"] as decimal?,
                        StartDate = dr["StartDate"] as string,
                        EndDate = dr["EndDate"] as string,
                        Capacity = dr["Capacity"] as int?,
                        RackRate = dr["RackRate"] as decimal?,
                        CostRate = dr["CostRate"] as decimal?,
                        Discount = dr["Discount"] as decimal?,
                        TotalCost = dr["TotalCost"] as decimal?,
                        ContractPercent = dr["ContractPercent"] as decimal?,
                        Subtotal = dr["Subtotal"] as decimal?,
                        DeliveryCost = dr["DeliveryCost"] as decimal?,
                        CostToSell = dr["CostToSell"] as decimal?,
                        TotalDiscount = dr["TotalDiscount"] as decimal?,
                        GrossProfit = dr["GrossProfit"] as decimal?,
                        WorkingDays = dr["WorkingDays"] as decimal?,
                        ActualWorkingDays = dr["ActualWorkingDays"] as int?

                    };
                    resourceEstimate.Add(resEst);
                }
                projectPricingDetails.PriceQuote = resourceEstimate;

                dr.NextResult();
                var expenseEstimate = new List<ExpenseQuote>();
                while (dr.Read())
                {
                    var expenseEst = new ExpenseQuote()
                    {

                        ExpenseType = dr["ExpenseType"] as string,
                        Description = dr["Description"] as string,
                        Billable = dr["Billable"] as int?,
                        UnitCost = dr["UnitCost"] as decimal?,
                        Number = dr["Number"] as int?,
                        LevantCost = dr["LevantCost"] as decimal?,
                        ClientCost = dr["ClientCost"] as decimal?,
                        Subtotal = dr["Subtotal"] as decimal?,
                    };
                    expenseEstimate.Add(expenseEst);
                }
                projectPricingDetails.ExpenseQuote = expenseEstimate;
                return projectPricingDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                con.Close();
            }
        }

        public string SaveService(List<ServiceTypeResponse> serviceTypes)
        {
            con.Open();
            try
            {
                string serviceTypeQuery = "DELETE from ServiceType";
                SqlCommand myCommand = new SqlCommand(serviceTypeQuery, con);
                myCommand.ExecuteNonQuery();

                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("service_type", typeof(string)));
                dt.Columns.Add(new DataColumn("service_description", typeof(string)));
                for (int i = 0; i < serviceTypes.Count; i++)
                {
                    dt.Rows.Add(serviceTypes[i].ServiceType, serviceTypes[i].ServiceDescription);
                }
                SqlBulkCopy serviceTypesBulkCopy = new SqlBulkCopy(con);

                serviceTypesBulkCopy.DestinationTableName = "ServiceType";
                serviceTypesBulkCopy.ColumnMappings.Add("service_type", "service_type");
                serviceTypesBulkCopy.ColumnMappings.Add("service_description", "service_description");
                serviceTypesBulkCopy.WriteToServer(dt);
                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                con.Close();
            }
        }

        public string SaveRates(List<Rate> rates)
        {
            con.Open();
            try
            {
                string deleteRatesQuery = "DELETE from Rates";
                SqlCommand myCommand = new SqlCommand(deleteRatesQuery, con);
                myCommand.ExecuteNonQuery();

                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("level", typeof(string)));
                dt.Columns.Add(new DataColumn("level_id", typeof(int)));
                dt.Columns.Add(new DataColumn("rack_rate", typeof(string)));
                dt.Columns.Add(new DataColumn("cost_rate", typeof(string)));
                for (int i = 0; i < rates.Count; i++)
                {
                    dt.Rows.Add(rates[i].Level, 1, rates[i].RackRate, rates[i].CostRate);
                }
                SqlBulkCopy rateBulkCopy = new SqlBulkCopy(con);

                rateBulkCopy.DestinationTableName = "Rates";
                rateBulkCopy.ColumnMappings.Add("level", "level");
                rateBulkCopy.ColumnMappings.Add("level_id", "level_id");
                rateBulkCopy.ColumnMappings.Add("rack_rate", "rack_rate");
                rateBulkCopy.ColumnMappings.Add("cost_rate", "cost_rate");
                rateBulkCopy.WriteToServer(dt);
                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                con.Close();
            }
        }

        public string SaveExpense(List<ExpenseTypeResponse> expenseTypes)
        {
            con.Open();
            try
            {
                string expenseTypeQuery = "DELETE from ExpenseType";
                SqlCommand myCommand = new SqlCommand(expenseTypeQuery, con);
                myCommand.ExecuteNonQuery();

                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("expense_type", typeof(string)));
                dt.Columns.Add(new DataColumn("expense_description", typeof(string)));
                for (int i = 0; i < expenseTypes.Count; i++)
                {
                    dt.Rows.Add(expenseTypes[i].ExpenseType, expenseTypes[i].ExpenseDescription);
                }
                SqlBulkCopy expenseTypesBulkCopy = new SqlBulkCopy(con);

                expenseTypesBulkCopy.DestinationTableName = "ExpenseType";
                expenseTypesBulkCopy.ColumnMappings.Add("expense_type", "expense_type");
                expenseTypesBulkCopy.ColumnMappings.Add("expense_description", "expense_description");
                expenseTypesBulkCopy.WriteToServer(dt);
                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                con.Close();
            }
        }

        public Root FetchSalesForecast()
        {
            var salesForecast = new Root();
            var saleData = new List<SalesForecast>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spSalesForecast", con);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var foreCast = new SalesForecast
                    {
                        MonthName = dr["MonthName"] as string,
                        ProjectStage = dr["ProjectStage"] as string,
                        TotalMonthlyRevenue = dr["TotalMonthlyRevenue"] as decimal?,
                    };
                    saleData.Add(foreCast);
                }

                salesForecast.labels = saleData.Select(x => x.MonthName).Distinct().ToList();
                salesForecast.labels = salesForecast.labels.OrderBy(s => DateTime.ParseExact(s, "MMMM", new CultureInfo("en-US"))).ToList();
                salesForecast.MaxValue = saleData.Max(x => x.TotalMonthlyRevenue);
                salesForecast.MaxValue = salesForecast.MaxValue;
                var status = saleData.Select(x => x.ProjectStage).Distinct().ToList();
                var datasets = new List<Dataset>();
                foreach (var st in status)
                {
                    var sumMonthlyData = new List<Decimal?>();
                    var set = new Dataset();
                    set.label = st;
                    foreach (var mon in salesForecast.labels)
                    {
                        var dt = new List<decimal?>();
                        Decimal? sumData = saleData.Where(x => x.ProjectStage.Equals(st) && x.MonthName.Equals(mon)).Select(x => x.TotalMonthlyRevenue).FirstOrDefault();
                        if (sumMonthlyData != null)
                        {
                            sumMonthlyData.Add(sumData);
                        }
                        set.data = sumMonthlyData;
                        set.borderWidth = 2;
                    }
                    if (st.Equals("Qualified"))
                    {
                        set.borderColor = "Red";
                        set.backgroundColor = "Orange";
                    }
                    else if (st.Equals("Won"))
                    {
                        set.borderColor = "Blue";
                        set.backgroundColor = "Violet";
                    }
                    else if (st.Equals("Won & Completed"))
                    {
                        set.borderColor = "Black";
                        set.backgroundColor = "Yellow";
                    }
                    datasets.Add(set);
                }
                salesForecast.datasets = datasets;
                return salesForecast;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        public (List<Consultant>, List<LeavesDetail>) FetchResourceWork(string userName)
        {
            var consultant = new List<Consultant>();
            var leavesDetail = new List<LeavesDetail>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spListUserWork", con);
                cmd.Parameters.AddWithValue("@consultant", userName);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var consultantWork = new Consultant
                    {
                        Activity = dr["Activity"] as string,
                        ProjectName = dr["ProjectName"] as string,
                        ProjectStartDate = dr["ProjectStartDate"] as string,
                        ProjectEndDate = dr["ProjectEndDate"] as string,
                        Capacity = dr["Capacity"] as int?,
                        ConsultantWorkdays = dr["WorkingDays"] as decimal?
                    };
                    consultant.Add(consultantWork);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    var leaveDetail = new LeavesDetail
                    {
                        LeaveType = dr["leave_type"] as string,
                        Duration = dr["duration"] as int?,
                        Reason = dr["reason"] as string,
                        UserId = dr["user_id"] as int?,
                        EndDate = dr["end_date"] as string,
                        StartDate = dr["start_date"] as string
                    };
                    leavesDetail.Add(leaveDetail);
                }
                return (consultant, leavesDetail);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        public string ManageLeaves(List<LeavesDetail> leavesDetail,int UserId)
        {
            con.Open();
            try
            {
                string deleteLeavesQuery = "DELETE from Leaves where user_id = @user_id ";
                SqlCommand myCommand = new SqlCommand(deleteLeavesQuery, con);
                myCommand.Parameters.AddWithValue("@user_id", UserId);
                myCommand.ExecuteNonQuery();

                DataTable dt = new DataTable();
                dt.Columns.Add(new DataColumn("user_id", typeof(int)));
                dt.Columns.Add(new DataColumn("duration", typeof(int)));
                dt.Columns.Add(new DataColumn("leave_type", typeof(string)));
                dt.Columns.Add(new DataColumn("reason", typeof(string)));
                dt.Columns.Add(new DataColumn("start_date", typeof(string)));
                dt.Columns.Add(new DataColumn("end_date", typeof(string)));
                dt.Columns.Add(new DataColumn("UserName", typeof(string)));
                for (int i = 0; i < leavesDetail.Count; i++)
                {
                    dt.Rows.Add(leavesDetail[0].UserId, leavesDetail[i].Duration, leavesDetail[i].LeaveType, leavesDetail[i].Reason, leavesDetail[i].StartDate, leavesDetail[i].EndDate, leavesDetail[0].UserName);
                }
                SqlBulkCopy leavesBulkCopy = new SqlBulkCopy(con);

                leavesBulkCopy.DestinationTableName = "Leaves";
                leavesBulkCopy.ColumnMappings.Add("user_id", "user_id");
                leavesBulkCopy.ColumnMappings.Add("duration", "duration");
                leavesBulkCopy.ColumnMappings.Add("leave_type", "leave_type");
                leavesBulkCopy.ColumnMappings.Add("reason", "reason");
                leavesBulkCopy.ColumnMappings.Add("start_date", "start_date");
                leavesBulkCopy.ColumnMappings.Add("end_date", "end_date");
                leavesBulkCopy.ColumnMappings.Add("UserName", "UserName");
                leavesBulkCopy.WriteToServer(dt);
                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);
            }
            finally
            {
                con.Close();
            }
        }

        public List<LeavesDetail> FetchLeaves(int userId)
        {
            throw new NotImplementedException();
        }

        public ResourceQuarterlyAllocation FetchQuarterlyAllocation(int userId)
        {
            var quarterlyAllocation = new List<QuarterlyAllocation>();
            var quarterLeaveAllocation = new List<LeaveAllocation>();
            var resourceAllocation = new ResourceQuarterlyAllocation();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spWorkDayAllocation", con);
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var allocation = new QuarterlyAllocation
                    {
                        MonthName = dr["MonthName"] as string,
                        TotalMonthlyWorkDays = dr["TotalMonthlyWorkDays"] as decimal?
                    };
                    quarterlyAllocation.Add(allocation);
                }

                dr.NextResult();
                while (dr.Read())
                {
                    var leaveAllc = new LeaveAllocation
                    {
                        MonthName = dr["MonthName"] as string,
                        TotalMonthlyWorkDays = dr["TotalMonthlyWorkDays"] as int?
                    };
                    quarterLeaveAllocation.Add(leaveAllc);
                }

                var currentDate = DateTime.Now;
                var currentQuarter = (currentDate.Month - 1) / 3 + 1;

                var currentQuarterSum = quarterlyAllocation
                    .Where(d => (DateTime.ParseExact(d.MonthName, "MMMM", CultureInfo.InvariantCulture).Month - 1) / 3 + 1 == currentQuarter)
                    .Sum(d => d.TotalMonthlyWorkDays);

                var previousQuarterSum = quarterlyAllocation
                    .Where(d => (DateTime.ParseExact(d.MonthName, "MMMM", CultureInfo.InvariantCulture).Month - 1) / 3 + 1 == currentQuarter - 1)
                    .Sum(d => d.TotalMonthlyWorkDays);

                var nextQuarterSum = quarterlyAllocation
                    .Where(d => (DateTime.ParseExact(d.MonthName, "MMMM", CultureInfo.InvariantCulture).Month - 1) / 3 + 1 == currentQuarter + 1)
                    .Sum(d => d.TotalMonthlyWorkDays);


                var currentQuarterLeaveSum = quarterLeaveAllocation
                    .Where(d => (DateTime.ParseExact(d.MonthName, "MMMM", CultureInfo.InvariantCulture).Month - 1) / 3 + 1 == currentQuarter)
                    .Sum(d => d.TotalMonthlyWorkDays);

                var previousQuarterLeaveSum = quarterLeaveAllocation
                    .Where(d => (DateTime.ParseExact(d.MonthName, "MMMM", CultureInfo.InvariantCulture).Month - 1) / 3 + 1 == currentQuarter - 1)
                    .Sum(d => d.TotalMonthlyWorkDays);

                var nextQuarterLeaveSum = quarterLeaveAllocation
                    .Where(d => (DateTime.ParseExact(d.MonthName, "MMMM", CultureInfo.InvariantCulture).Month - 1) / 3 + 1 == currentQuarter + 1)
                    .Sum(d => d.TotalMonthlyWorkDays);


                DateTime[] holidays = new DateTime[]
        {
            //// Add your holiday dates here
            //new DateTime(2023, 1, 1), // Example: New Year's Day
            //new DateTime(2023, 12, 25), // Example: Christmas Day
            //// ...
        };

                int workingDaysCurrentQuarter = Enumerable.Range(1, 3)
                .SelectMany(q => Enumerable.Range(((q - 1) * 3) + 1, 3))
                .Where(m => (m - 1) / 3 + 1 == currentQuarter)
                .SelectMany(m => Enumerable.Range(1, DateTime.DaysInMonth(currentDate.Year, m))
                    .Select(d => new DateTime(currentDate.Year, m, d)))
                .Count(d => d.DayOfWeek != DayOfWeek.Saturday
                            && d.DayOfWeek != DayOfWeek.Sunday
                            && !holidays.Contains(d));

                int workingDaysPreviousQuarter = Enumerable.Range(1, 3)
            .SelectMany(q => Enumerable.Range(((q - 1) * 3) + 1, 3))
            .Where(m => (m - 1) / 3 + 1 == currentQuarter - 1)
            .SelectMany(m => Enumerable.Range(1, DateTime.DaysInMonth(currentDate.Year, m))
                .Select(d => new DateTime(currentDate.Year, m, d)))
            .Count(d => d.DayOfWeek != DayOfWeek.Saturday
                        && d.DayOfWeek != DayOfWeek.Sunday
                        && !holidays.Contains(d));

                int workingDaysNextQuarter = Enumerable.Range(1, 3)
                    .SelectMany(q => Enumerable.Range(((q - 1) * 3) + 1, 3))
                    .Where(m => (m - 1) / 3 + 1 == currentQuarter + 1)
                    .SelectMany(m => Enumerable.Range(1, DateTime.DaysInMonth(currentDate.Year, m))
                        .Select(d => new DateTime(currentDate.Year, m, d)))
                    .Count(d => d.DayOfWeek != DayOfWeek.Saturday
                                && d.DayOfWeek != DayOfWeek.Sunday
                                && !holidays.Contains(d));

                decimal? currentQuarterPercentAllocation = (currentQuarterSum / (workingDaysCurrentQuarter - currentQuarterLeaveSum)) * 100;
                decimal? previousQuarterPercentAllocation = (previousQuarterSum / (workingDaysPreviousQuarter - previousQuarterLeaveSum)) * 100;
                decimal? nextQuarterPercentAllocation = (nextQuarterSum / (workingDaysNextQuarter - nextQuarterLeaveSum)) * 100;

                resourceAllocation.currentQuarterSum = currentQuarterSum;
                resourceAllocation.previousQuarterSum = previousQuarterSum;
                resourceAllocation.nextQuarterSum = nextQuarterSum;
                resourceAllocation.currentQuarterLeaveSum = currentQuarterLeaveSum;
                resourceAllocation.previousQuarterLeaveSum = previousQuarterLeaveSum;
                resourceAllocation.nextQuarterLeaveSum = nextQuarterLeaveSum;
                resourceAllocation.currentQuarterPercentAllocation = currentQuarterPercentAllocation;
                resourceAllocation.previousQuarterPercentAllocation = previousQuarterPercentAllocation;
                resourceAllocation.nextQuarterPercentAllocation = nextQuarterPercentAllocation;

                return resourceAllocation;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        public ProjectAllocation FetchWeeklyAllocation(int userId)
        {
            var projectAllocation = new ProjectAllocation();
            string profileImage = string.Empty;
            var weeklyAllocation = new List<WeeklyAllocation>();
            var allocatedProjects = new List<ProjectDetails>();
            Dictionary<string, int> rowSpanCount = new Dictionary<string, int>();
            Dictionary<string, int> repeatCount = new Dictionary<string, int>();
            Dictionary<string, string> projectWithStage = new Dictionary<string, string>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spFetchWeekDates", con);
                cmd.Parameters.AddWithValue("@UserId",userId);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var allocation = new WeeklyAllocation
                    {
                        RepeatCount = 0,
                        consultant = "",
                        profileUrl = "Header",
                        Week1 = dr["Week1"].ToString(),
                        Week2 = dr["Week2"].ToString(),
                        Week3 = dr["Week3"].ToString(),
                        Week4 = dr["Week4"].ToString(),
                        Week5 = dr["Week5"].ToString(),
                        Week6 = dr["Week6"].ToString(),
                        Week7 = dr["Week7"].ToString(),
                        Week8 = dr["Week8"].ToString(),
                        Week9 = dr["Week9"].ToString(),
                        Week10 = dr["Week10"].ToString(),
                        Week11 = dr["Week11"].ToString(),
                        Week12 = dr["Week12"].ToString()
                    };
                    weeklyAllocation.Add(allocation);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    var projAllocation = new ProjectDetails()
                    {
                        Resource = dr["consultant"].ToString(),
                        ProjectName = dr["project_name"].ToString(),
                        StartDate = dr["start_Date"].ToString(),
                        EndDate = dr["end_date"].ToString(),
                        Stage = dr["ProjectStage"].ToString()
                    };
                    allocatedProjects.Add(projAllocation);
                }
                var projectDet = new ProjectDetails();
                var uniqueProjects = allocatedProjects.Where(x => x.Stage != "Leave").GroupBy(x => x.ProjectName).
                    Select(y => (ProjectName: projectDet.ProjectName = y.Key, ProjectStage: projectDet.Stage = y.First().Stage)).ToList();
                foreach (var proj in uniqueProjects)
                {
                    projectWithStage.Add(proj.ProjectName, proj.ProjectStage);
                }
                dr.NextResult();
                var consultant = new List<UserDetails>();
                while (dr.Read())
                {
                    var resource = new UserDetails()
                    {
                        ProfileImage = dr["ProfileImage"].ToString(),
                        displayName = dr["UserName"].ToString()
                    };
                    consultant.Add(resource);
                }
                for (int i = 0; i < allocatedProjects.Count; i++)
                {
                    var resAllocation = new WeeklyAllocation()
                    {
                        RepeatCount = fetchRepeatCount(allocatedProjects[i].Resource, repeatCount),
                        consultant = allocatedProjects[i].Resource,
                        profileUrl = FetchProfileUrl(consultant, allocatedProjects[i].Resource),
                        Week1 = FindAllocatedProject(weeklyAllocation[0].Week1, weeklyAllocation[0].Week2, allocatedProjects[i]),
                        Week2 = FindAllocatedProject(weeklyAllocation[0].Week2, weeklyAllocation[0].Week3, allocatedProjects[i]),
                        Week3 = FindAllocatedProject(weeklyAllocation[0].Week3, weeklyAllocation[0].Week4, allocatedProjects[i]),
                        Week4 = FindAllocatedProject(weeklyAllocation[0].Week4, weeklyAllocation[0].Week5, allocatedProjects[i]),
                        Week5 = FindAllocatedProject(weeklyAllocation[0].Week5, weeklyAllocation[0].Week6, allocatedProjects[i]),
                        Week6 = FindAllocatedProject(weeklyAllocation[0].Week6, weeklyAllocation[0].Week7, allocatedProjects[i]),
                        Week7 = FindAllocatedProject(weeklyAllocation[0].Week7, weeklyAllocation[0].Week8, allocatedProjects[i]),
                        Week8 = FindAllocatedProject(weeklyAllocation[0].Week8, weeklyAllocation[0].Week9, allocatedProjects[i]),
                        Week9 = FindAllocatedProject(weeklyAllocation[0].Week9, weeklyAllocation[0].Week10, allocatedProjects[i]),
                        Week10 = FindAllocatedProject(weeklyAllocation[0].Week10, weeklyAllocation[0].Week11, allocatedProjects[i]),
                        Week11 = FindAllocatedProject(weeklyAllocation[0].Week11, weeklyAllocation[0].Week12, allocatedProjects[i]),
                        Week12 = FindAllocatedProject(weeklyAllocation[0].Week12, weeklyAllocation[0].Week12, allocatedProjects[i])
                    };
                    weeklyAllocation.Add(resAllocation);
                }
                var headerList = weeklyAllocation.Take(1).ToList();
                var dataList = weeklyAllocation.Skip(1).ToList();
                // dataList = dataList.Where(x => !string.IsNullOrEmpty(x.Week1) || !string.IsNullOrEmpty(x.Week2) || !string.IsNullOrEmpty(x.Week3) || !string.IsNullOrEmpty(x.Week4) || !string.IsNullOrEmpty(x.Week5) || !string.IsNullOrEmpty(x.Week6) || !string.IsNullOrEmpty(x.Week7) || !string.IsNullOrEmpty(x.Week8) || !string.IsNullOrEmpty(x.Week9) && !string.IsNullOrEmpty(x.Week10) || !string.IsNullOrEmpty(x.Week11) || !string.IsNullOrEmpty(x.Week12)).ToList();
                var orderedList = dataList.OrderBy(x => x.consultant).ThenBy(x => x.RepeatCount).ToList();
                var finalList = new List<WeeklyAllocation>();
                finalList.AddRange(headerList);
                finalList.AddRange(orderedList);
                foreach (var data in finalList)
                {
                    if (rowSpanCount.ContainsKey(data.consultant))
                    {
                        data.RowSpan = 0;
                    }
                    else
                    {
                        int count = finalList.FindAll(p => p.consultant == data.consultant).Count;
                        data.RowSpan = count;
                        rowSpanCount[data.consultant] = count;
                    }
                }
                projectAllocation.projectWithStage = projectWithStage;
                projectAllocation.teamsAllocations = finalList;
                return projectAllocation;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }
           

        public string DefaultProfile()
        {
            return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBvRXhpZgAASUkqAAgAAAABAA4BAgBNAAAAGgAAAAAAAABVc2VyIEljb24gRmxhdCBJc29sYXRlZCBvbiBXaGl0ZSBCYWNrZ3JvdW5kLiBVc2VyIFN5bWJvbC4gVmVjdG9yIElsbHVzdHJhdGlvbv/hBWRodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgcGhvdG9zaG9wOkNyZWRpdD0iR2V0dHkgSW1hZ2VzIiBHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD0iMTMwMDg0NTYyMCIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL2xlZ2FsL2xpY2Vuc2UtYWdyZWVtZW50P3V0bV9tZWRpdW09b3JnYW5pYyZhbXA7dXRtX3NvdXJjZT1nb29nbGUmYW1wO3V0bV9jYW1wYWlnbj1pcHRjdXJsIiA+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+UGV0ZXJQZW5jaWw8L3JkZjpsaT48L3JkZjpTZXE+PC9kYzpjcmVhdG9yPjxkYzpkZXNjcmlwdGlvbj48cmRmOkFsdD48cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPlVzZXIgSWNvbiBGbGF0IElzb2xhdGVkIG9uIFdoaXRlIEJhY2tncm91bmQuIFVzZXIgU3ltYm9sLiBWZWN0b3IgSWxsdXN0cmF0aW9uPC9yZGY6bGk+PC9yZGY6QWx0PjwvZGM6ZGVzY3JpcHRpb24+CjxwbHVzOkxpY2Vuc29yPjxyZGY6U2VxPjxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPjxwbHVzOkxpY2Vuc29yVVJMPmh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9waG90by9saWNlbnNlLWdtMTMwMDg0NTYyMC0/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmw8L3BsdXM6TGljZW5zb3JVUkw+PC9yZGY6bGk+PC9yZGY6U2VxPjwvcGx1czpMaWNlbnNvcj4KCQk8L3JkZjpEZXNjcmlwdGlvbj4KCTwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz4K/+0AkFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAABzHAJQAAtQZXRlclBlbmNpbBwCeABNVXNlciBJY29uIEZsYXQgSXNvbGF0ZWQgb24gV2hpdGUgQmFja2dyb3VuZC4gVXNlciBTeW1ib2wuIFZlY3RvciBJbGx1c3RyYXRpb24cAm4ADEdldHR5IEltYWdlcwD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/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AAAAAAAAAAAAxAAAAAAAIAAAAAAAAGAAAAAAA4AAAAAAAAAAAAP4AAAAAAAAAAAAAAABwAAAAAAGOAAAAAAAAAAAAOAAAAAABwAAAAAAAAGAAAAAABAwAAAAAAAAAAAxAAAAAAAOAAAAAAAAAAAAAAAABwAAAAAAAAAAAGIAAAAAABwAAAAAAAAOAAAAAAAGIAAAAAAAAAAA/AAAAAAAAAAAAAAAABwAAAAAABxAAAAAAAAAAAFwAAAAAABEAAAAAAAAOAAAAAAAAGAAAAAAAAAAAGAAAAAAAAwAAAAAAABAAAAAAABAwAAAAAAAAABAwAAAAAAABAAAAAAAAwAAAAAAAIOAAAAAAAAAAAOAAAAAAAAPAAAAAAA4AAAAAAAABwAAAAAAAAAABwAAAAAAAAOAAAAAAwAAAAAAAAIGAAAAAAAAAAJGAAAAAAAAABwAAAJwAAAAAAAAAAwAAAAAAAAAAOwAAAAAAAAAJ2AA/AAAAAAAAAAOGAAAAAAAAAAAwAAAAAAAAAAAAAIAAAAAAAAAABxAAAAAAAAAAAGIAAAAAAAAABJPxIAAAAAAAAAAHAAAAAAAAAAAAwwAAAAAAAAO8AAAH4AAAAAAAAJ+AAAAAAAAAAABOAAAAAAAJ+AAAAAAHAAAAAAAAAwAAAAAAAAAAAGAAAAAAAJwAAAAAAAAwAAAAAAGIAAAAAAAAAAABxwAAAAAOAAAAAAAAAA4AAAAAJwAAAAAAAAAAAAIGAAAABOAAAAAAAAAAAIAAAABBwAAAAAAAAAAAAGAAAABOAAAAAAAAAAAAIAAAAPIAAAAAAAAAAAAAJ4AAAOAAAAAAAAAAAAAwAAAAOAAAAAAAAAAAAABxwAAJAAAAAAAAAAAAAAwAAI5AAAAAAAAAAAAAAJGAABwAAAAAAAAAAAAAAAABwwAAAAAAAAAAAAAAGPABAAAAAAAAAAAAAAAOABB4AAAAAAAAAAAAAABOGAOAAAAAAAAAAAAAAAIAHAAAAAAAAAAAAAAAABPGAwAAAAAAAAAAAAAAJAGOAAAAAAAAAAAAAAAAAHGBwAAAAAAAAAAAAAHAGGAAAAAAAAAAAAAAAAABGGAwAAAAAAAAAAAAGAGHAAAAAAAAAAAAAAAAAAAGGAGAAAAAAAAAAA3BGHAAAAAAAAAAAAAAAAAAABOOAB4AAAAAAAAP4JxOAAAAAAAAAAA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";
        }

        private string FindAllocatedProject(string startWeek, string endWeek, ProjectDetails allocatedProjects)
        {
            //tempcon.Open();

            //string errorQuery = "INSERT INTO Errors (error_description, created_date)";
            //errorQuery += " VALUES (@error_description,@created_date)";

            //SqlCommand errorCommand = new SqlCommand(errorQuery, tempcon);
            //errorCommand.Parameters.AddWithValue("@error_description", startWeek);
            //errorCommand.Parameters.AddWithValue("@created_date", DateTime.Now.ToString());
            //errorCommand.ExecuteNonQuery();
            //tempcon.Close();
            //return "";
            //if (allocatedProjects.ProjectName.Contains("leave"))
            //{
            //    //
            //}


            DateTime stWeek = DateTime.ParseExact(startWeek, "M/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture);
            DateTime eWeek = DateTime.ParseExact(endWeek, "M/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture).AddDays(-1);

            //works in local
            //DateTime stWeek = DateTime.ParseExact(startWeek, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            //DateTime eWeek = DateTime.ParseExact(endWeek, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture).AddDays(-1);
            DateTime projectStartDate = DateTime.ParseExact(allocatedProjects.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime projectEndDate = DateTime.ParseExact(allocatedProjects.EndDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            //if (projectStartDate <= stWeek && projectStartDate <= eWeek && projectEndDate >= stWeek)
            //{
            //    return allocatedProjects.ProjectName;
            //}
            //else
            //{
            //    return string.Empty;
            //}

            if (projectEndDate < stWeek || projectStartDate > eWeek)
            {
                return string.Empty;
            }
            else
            {
                return allocatedProjects.ProjectName;
            }
        }

        public void DeletePricing(string projectId)
        {
            con.Open();
            try
            {
                DeleteExistingRecordBeforeUpdating(projectId);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        public ProjectAllocation FetchTeamAllocation()
        {
            var projectAllocation = new ProjectAllocation();
            string profileImage = string.Empty;
            var weeklyAllocation = new List<WeeklyAllocation>();
            var allocatedProjects = new List<ProjectDetails>();
            Dictionary<string, int> rowSpanCount = new Dictionary<string, int>();
            Dictionary<string, int> repeatCount = new Dictionary<string, int>();
            Dictionary<string, string> projectWithStage = new Dictionary<string, string>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spFetchTeamAllocations", con);
                cmd.CommandType = CommandType.StoredProcedure;
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var allocation = new WeeklyAllocation
                    {
                        RepeatCount = 0,
                        consultant = "",
                        profileUrl = "Header",
                        Week1 = dr["Week1"].ToString(),
                        Week2 = dr["Week2"].ToString(),
                        Week3 = dr["Week3"].ToString(),
                        Week4 = dr["Week4"].ToString(),
                        Week5 = dr["Week5"].ToString(),
                        Week6 = dr["Week6"].ToString(),
                        Week7 = dr["Week7"].ToString(),
                        Week8 = dr["Week8"].ToString(),
                        Week9 = dr["Week9"].ToString(),
                        Week10 = dr["Week10"].ToString(),
                        Week11 = dr["Week11"].ToString(),
                        Week12 = dr["Week12"].ToString()
                    };
                    weeklyAllocation.Add(allocation);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    var projAllocation = new ProjectDetails()
                    {
                        Resource = dr["consultant"].ToString(),
                        ProjectName = dr["project_name"].ToString(),
                        StartDate = dr["start_Date"].ToString(),
                        EndDate = dr["end_date"].ToString(),
                        Stage = dr["ProjectStage"].ToString()
                    };
                    allocatedProjects.Add(projAllocation);
                }
                var projectDet = new ProjectDetails();
                var uniqueProjects = allocatedProjects.Where(x => x.Stage != "Leave").GroupBy(x => x.ProjectName).
                    Select(y => (ProjectName: projectDet.ProjectName = y.Key, ProjectStage: projectDet.Stage = y.First().Stage)).ToList();
                foreach(var proj in uniqueProjects)
                {
                    projectWithStage.Add(proj.ProjectName, proj.ProjectStage);
                }
                dr.NextResult();
                var consultant = new List<UserDetails>();
                while (dr.Read())
                {
                    var resource = new UserDetails()
                    {
                        ProfileImage = dr["ProfileImage"].ToString(),
                        displayName = dr["UserName"].ToString()
                    };
                    consultant.Add(resource);
                }
                for (int i = 0; i < allocatedProjects.Count; i++)
                {
                    var resAllocation = new WeeklyAllocation()
                    {
                        RepeatCount = fetchRepeatCount(allocatedProjects[i].Resource, repeatCount),
                        consultant = allocatedProjects[i].Resource,
                        profileUrl = FetchProfileUrl(consultant, allocatedProjects[i].Resource),
                        Week1 = FindAllocatedProject(weeklyAllocation[0].Week1, weeklyAllocation[0].Week2, allocatedProjects[i]),
                        Week2 = FindAllocatedProject(weeklyAllocation[0].Week2, weeklyAllocation[0].Week3, allocatedProjects[i]),
                        Week3 = FindAllocatedProject(weeklyAllocation[0].Week3, weeklyAllocation[0].Week4, allocatedProjects[i]),
                        Week4 = FindAllocatedProject(weeklyAllocation[0].Week4, weeklyAllocation[0].Week5, allocatedProjects[i]),
                        Week5 = FindAllocatedProject(weeklyAllocation[0].Week5, weeklyAllocation[0].Week6, allocatedProjects[i]),
                        Week6 = FindAllocatedProject(weeklyAllocation[0].Week6, weeklyAllocation[0].Week7, allocatedProjects[i]),
                        Week7 = FindAllocatedProject(weeklyAllocation[0].Week7, weeklyAllocation[0].Week8, allocatedProjects[i]),
                        Week8 = FindAllocatedProject(weeklyAllocation[0].Week8, weeklyAllocation[0].Week9, allocatedProjects[i]),
                        Week9 = FindAllocatedProject(weeklyAllocation[0].Week9, weeklyAllocation[0].Week10, allocatedProjects[i]),
                        Week10 = FindAllocatedProject(weeklyAllocation[0].Week10, weeklyAllocation[0].Week11, allocatedProjects[i]),
                        Week11 = FindAllocatedProject(weeklyAllocation[0].Week11, weeklyAllocation[0].Week12, allocatedProjects[i]),
                        Week12 = FindAllocatedProject(weeklyAllocation[0].Week12, weeklyAllocation[0].Week12, allocatedProjects[i])
                    };
                    weeklyAllocation.Add(resAllocation);
                }
                var headerList = weeklyAllocation.Take(1).ToList();
                var dataList = weeklyAllocation.Skip(1).ToList();
               // dataList = dataList.Where(x => !string.IsNullOrEmpty(x.Week1) || !string.IsNullOrEmpty(x.Week2) || !string.IsNullOrEmpty(x.Week3) || !string.IsNullOrEmpty(x.Week4) || !string.IsNullOrEmpty(x.Week5) || !string.IsNullOrEmpty(x.Week6) || !string.IsNullOrEmpty(x.Week7) || !string.IsNullOrEmpty(x.Week8) || !string.IsNullOrEmpty(x.Week9) && !string.IsNullOrEmpty(x.Week10) || !string.IsNullOrEmpty(x.Week11) || !string.IsNullOrEmpty(x.Week12)).ToList();
                var orderedList = dataList.OrderBy(x => x.consultant).ThenBy(x=>x.RepeatCount).ToList();
                var finalList = new List<WeeklyAllocation>();
                finalList.AddRange(headerList);
                finalList.AddRange(orderedList);
                foreach(var data in finalList)
                {
                    if (rowSpanCount.ContainsKey(data.consultant))
                    {
                        data.RowSpan = 0;
                    }
                    else
                    {
                        int count = finalList.FindAll(p => p.consultant == data.consultant).Count;
                        data.RowSpan = count;
                        rowSpanCount[data.consultant] = count;
                    }
                }
                projectAllocation.projectWithStage = projectWithStage;
                projectAllocation.teamsAllocations = finalList;
                return projectAllocation;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }
        }

        private int fetchRepeatCount(string resource,Dictionary<string,int> repeatCount)
        {
            int count = 0;
            if (repeatCount.ContainsKey(resource))
            {

                count = repeatCount[resource] + 1;
                repeatCount[resource] = count;
            }
            else
            {
                count = 1;
                repeatCount.Add(resource, count);

            }
            return count;
        }

        private string FetchProfileUrl(List<UserDetails> consultant, string resource)
        {
            string profileUrl = consultant.Where(x => x.displayName.Equals(resource)).Select(x => x.ProfileImage).FirstOrDefault();
            if (string.IsNullOrEmpty(profileUrl))
            {
                profileUrl = DefaultProfile();
            }
            return profileUrl;
        }

        public List<ResourceUtlisation> UlitstationByLevels()
        {
            var projectAllocation = new ProjectAllocation();
            var suppplies = new List<SupplyLevel>();
            var userAllocation = new List<PriceQuote>();
            var allocatedProjects = new List<ProjectDetails>();
            var resourceUtlisations = new List<ResourceUtlisation>();
            Dictionary<string, int> rowSpanCount = new Dictionary<string, int>();
            Dictionary<string, int> repeatCount = new Dictionary<string, int>();
            Dictionary<string, string> projectWithStage = new Dictionary<string, string>();
            con.Open();
            try
            {
                SqlDataReader dr;
                SqlCommand cmd = new SqlCommand("spUlitstationByLevels", con);
                dr = cmd.ExecuteReader();
                while (dr.Read())
                {
                    var allocation = new ResourceUtlisation()
                    {
                        RepeatCount = 0,
                        Level = "Header",
                        SupplyOrDemand = "Test",
                        Week1 = dr["Week1"].ToString(),
                        Week2 = dr["Week2"].ToString(),
                        Week3 = dr["Week3"].ToString(),
                        Week4 = dr["Week4"].ToString(),
                        Week5 = dr["Week5"].ToString(),
                        Week6 = dr["Week6"].ToString(),
                        Week7 = dr["Week7"].ToString(),
                        Week8 = dr["Week8"].ToString(),
                        Week9 = dr["Week9"].ToString(),
                        Week10 = dr["Week10"].ToString(),
                        Week11 = dr["Week11"].ToString(),
                        Week12 = dr["Week12"].ToString()
                    };
                    resourceUtlisations.Add(allocation);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    var supply = new SupplyLevel()
                    {
                        WeeklySupply = dr["WeeklySupply"] as int?,
                        level = dr["level"].ToString(),
                    };
                    suppplies.Add(supply);
                }
                dr.NextResult();
                while (dr.Read())
                {
                    var allocation = new PriceQuote()
                    {
                        Level = dr["level"].ToString(),
                        Consultant = dr["consultant"].ToString(),
                        StartDate = dr["start_date"].ToString(),
                        EndDate = dr["end_date"].ToString(),
                    };
                    userAllocation.Add(allocation);
                }
                for (int i = 0; i < suppplies.Count; i++)
                {
                    var resUtlisation = new ResourceUtlisation()
                    {
                        Level = suppplies[i].level,
                        SupplyOrDemand = "Supply",
                        Week1 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week2 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week3 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week4 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week5 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week6 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week7 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week8 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week9 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week10 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week11 = FindWeeklySupply(suppplies[i].level, suppplies),
                        Week12 = FindWeeklySupply(suppplies[i].level, suppplies)
                    };
                    resourceUtlisations.Add(resUtlisation);
                }
                for (int i = 0; i < suppplies.Count; i++)
                {
                    var resUtlisation = new ResourceUtlisation()
                    {
                        Level = suppplies[i].level,
                        SupplyOrDemand = "Demand",
                        Week1 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week1.ToString(), resourceUtlisations[0].Week2.ToString(), userAllocation),
                        Week2 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week2.ToString(), resourceUtlisations[0].Week3.ToString(), userAllocation),
                        Week3 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week3.ToString(), resourceUtlisations[0].Week4.ToString(), userAllocation),
                        Week4 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week4.ToString(), resourceUtlisations[0].Week5.ToString(), userAllocation),
                        Week5 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week5.ToString(), resourceUtlisations[0].Week6.ToString(), userAllocation),
                        Week6 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week6.ToString(), resourceUtlisations[0].Week7.ToString(), userAllocation),
                        Week7 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week7.ToString(), resourceUtlisations[0].Week8.ToString(), userAllocation),
                        Week8 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week8.ToString(), resourceUtlisations[0].Week9.ToString(), userAllocation),
                        Week9 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week9.ToString(), resourceUtlisations[0].Week10.ToString(), userAllocation),
                        Week10 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week10.ToString(), resourceUtlisations[0].Week11.ToString(), userAllocation),
                        Week11 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week11.ToString(), resourceUtlisations[0].Week12.ToString(), userAllocation),
                        Week12 = FindWeeklyDemand(suppplies[i].level, resourceUtlisations[0].Week12.ToString(), resourceUtlisations[0].Week12.ToString(), userAllocation),
                    };
                    resourceUtlisations.Add(resUtlisation);
                }
                var headerList = resourceUtlisations.Take(1).ToList();
                var dataList = resourceUtlisations.Skip(1).ToList();
                // dataList = dataList.Where(x => !string.IsNullOrEmpty(x.Week1) || !string.IsNullOrEmpty(x.Week2) || !string.IsNullOrEmpty(x.Week3) || !string.IsNullOrEmpty(x.Week4) || !string.IsNullOrEmpty(x.Week5) || !string.IsNullOrEmpty(x.Week6) || !string.IsNullOrEmpty(x.Week7) || !string.IsNullOrEmpty(x.Week8) || !string.IsNullOrEmpty(x.Week9) && !string.IsNullOrEmpty(x.Week10) || !string.IsNullOrEmpty(x.Week11) || !string.IsNullOrEmpty(x.Week12)).ToList();
                var orderedList = dataList.OrderBy(x => x.Level).ThenBy(x => x.RepeatCount).ToList();
                var finalList = new List<ResourceUtlisation>();
                finalList.AddRange(headerList);
                finalList.AddRange(orderedList);
                foreach (var data in finalList)
                {
                    if (rowSpanCount.ContainsKey(data.Level))
                    {
                        data.RowSpan = 0;
                    }
                    else
                    {
                        int count = finalList.FindAll(p => p.Level == data.Level).Count;
                        data.RowSpan = count;
                        rowSpanCount[data.Level] = count;
                    }
                }
                List<string> CustomOrder = new List<string>
                {
                    "FY24 Director",
                    "FY24 Manager",
                    "FY24 Principal",
                    "FY24 Senior Associate",
                    "FY24 Associate",
                    "FY24 Graduate"

                };
                return finalList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception is : " + ex.Message);
                throw new Exception(ex.Message);

            }
            finally
            {
                con.Close();
            }

        }

        private string FindWeeklyDemand(string level, string weekStartDate, string weekEndDate, List<PriceQuote> userAllocation)
        {
            DateTime weekStartD = Convert.ToDateTime(weekStartDate);
            DateTime weekEndD = Convert.ToDateTime(weekEndDate);
            // Filter userAllocation list based on the specified level
            var filteredUsers = userAllocation.Where(u => u.Level == level).ToList();
            int sumOfWeekdays = 0;
            foreach (var user in filteredUsers)
            {
                // Adjust project start and end dates to ensure they fall within the specified week
                DateTime projectStartDate = Convert.ToDateTime(user.StartDate) > weekStartD ? Convert.ToDateTime(user.EndDate) : Convert.ToDateTime(weekStartDate);
                DateTime projectEndDate = Convert.ToDateTime(user.EndDate) < weekEndD ? Convert.ToDateTime(user.EndDate) : Convert.ToDateTime(weekEndDate);

                // Calculate the number of weekdays between project start and end dates
                int weekdays = CountWeekdays(projectStartDate, projectEndDate);
                sumOfWeekdays += weekdays;
            }
            string sumofdays = Convert.ToString(sumOfWeekdays);
            return sumofdays;
        }

        // Helper method to count the number of weekdays between two dates
        private int CountWeekdays(DateTime startDate, DateTime endDate)
        {
            int count = 0;
            DateTime currentDate = startDate;

            while (currentDate <= endDate)
            {
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    count++;
                }
                currentDate = currentDate.AddDays(1);
            }

            return count;
        }

        private string FindWeeklySupply(string level, List<SupplyLevel> suppplies)
        {
            int? weeklySupply = suppplies.Where(x => x.level.Equals(level)).Select(x => x.WeeklySupply).FirstOrDefault();
            string supply = Convert.ToString(weeklySupply);
            return supply;
        }
    }
}