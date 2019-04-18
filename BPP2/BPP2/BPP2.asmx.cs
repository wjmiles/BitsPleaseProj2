using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

// Connection to DB
using MySql.Data;
using MySql.Data.MySqlClient;
// DB data manipulation
using System.Data;

namespace BPP2
{
    /// <summary>
    /// Summary description for BPP2
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class BPP2 : System.Web.Services.WebService
    {

        //log on
        [WebMethod(EnableSession = true)]
        public Account[] LogOn(string employeeId, string password)
        {
            string sqlConnectionSring = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            string sqlSelect = "SELECT EmployeeID FROM employee WHERE EmployeeID=@employeeIdValue and Password=@passwordValue";
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionSring);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));
            sqlCommand.Parameters.AddWithValue("@passwordValue", HttpUtility.UrlDecode(password));

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();
            sqlDa.Fill(sqlDt);
            List<Account> accountTemp = new List<Account>();
            if (sqlDt.Rows.Count > 0)
            {
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    accountTemp.Add(new Account
                    {
                        employeeId = sqlDt.Rows[i]["EmployeeID"].ToString()
                        //password = sqlDt.Rows[i]["Password"].ToString(),
                        //firstName = sqlDt.Rows[i]["FirstName"].ToString(),
                        //lastName = sqlDt.Rows[i]["LastName"].ToString(),
                        //position = sqlDt.Rows[i]["Position"].ToString(),
                        //department = sqlDt.Rows[i]["Department"].ToString(),
                        //location = sqlDt.Rows[i]["Location"].ToString(),
                        //badge = Convert.ToInt32(sqlDt.Rows[i]["Badges"])
                    });
                }
            }
            return accountTemp.ToArray();
        }

        [WebMethod(EnableSession = true)]
        public Account[] GetAccount(string employeeId)
        {
            DataTable sqlDt = new DataTable("account");

            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT * FROM employee WHERE EmployeeID=@employeeIdValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            sqlDa.Fill(sqlDt);

            List<Account> account = new List<Account>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                account.Add(new Account
                {
                    employeeId = sqlDt.Rows[i]["EmployeeID"].ToString(),
                    password = sqlDt.Rows[i]["Password"].ToString(),
                    firstName = sqlDt.Rows[i]["FirstName"].ToString(),
                    lastName = sqlDt.Rows[i]["LastName"].ToString(),
                    position = sqlDt.Rows[i]["Position"].ToString(),
                    department = sqlDt.Rows[i]["Department"].ToString(),
                    location = sqlDt.Rows[i]["Location"].ToString(),
                    badge = Convert.ToInt32(sqlDt.Rows[i]["Badges"])
                });
            }
            return account.ToArray();
        }

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }


        //update password
        [WebMethod(EnableSession = true)]
        public void UpdatePassword(string employeeId, string password)
        {
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //"UPDATE users SET ScreenName=@screenNameValue, Email=@emailValue, FirstName=@firstNameValue, LastName=@lastNameValue, " +
            string sqlSelect = "UPDATE employee SET Password=@passwordValue " +
                               "WHERE EmployeeID=@employeeIdValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@passwordValue", HttpUtility.UrlDecode(password));
            sqlCommand.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));

            sqlConnection.Open();
            try
            {
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
        }

        //determine badgeId
        [WebMethod(EnableSession = true)]
        public string GetBadge(string employeeId, string badge)
        {
            string ret = "9";
            //DataTable sqlDt = new DataTable("account");

            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //var badgeId = Convert.ToInt32(badge);
            string sqlSelect = "UPDATE employee SET Badges=@badgeValue " +
                               "WHERE EmployeeID=@employeeIdValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@badgeValue", HttpUtility.UrlDecode(badge));
            sqlCommand.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));

            sqlConnection.Open();
            try
            {
                sqlCommand.ExecuteNonQuery();
                ret = badge;
            }
            catch (Exception e)
            {
                ret = badge + "EXCEPTION";
            }
            sqlConnection.Close();
            return ret;
        }

        //add topic and comment
        [WebMethod(EnableSession = true)]
        public void SubmitTopic(string employeeId, string topicTitle, string category, string location, string comment)
        {
            string sqlConnectionSring = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            string sqlSelect = "INSERT INTO `topic` (`EmployeeID`, `TopicTitle`, `TopicCategory`, `TopicLocation`, `TopicRelevanceCounter`)" + 
                               "VALUES (@employeeIdValue, @topicTitleValue, @categoryValue, @locationValue, 1); SELECT @@IDENTITY;";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionSring);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));
            sqlCommand.Parameters.AddWithValue("@topicTitleValue", HttpUtility.UrlDecode(topicTitle));
            sqlCommand.Parameters.AddWithValue("@categoryValue", HttpUtility.UrlDecode(category));
            sqlCommand.Parameters.AddWithValue("@locationValue", HttpUtility.UrlDecode(location));

            sqlConnection.Open();
            try
            {
                int topicID = Convert.ToInt32(sqlCommand.ExecuteScalar());

                string sqlConnectionSring2 = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

                string sqlSelect2 = "INSERT INTO `suggestions` (`TopicID`, `EmployeeID`, `SuggestionContent`) VALUES(@topicIdValue, @employeeIdValue, @commentValue);";

                MySqlConnection sqlConnection2 = new MySqlConnection(sqlConnectionSring2);
                MySqlCommand sqlCommand2 = new MySqlCommand(sqlSelect2, sqlConnection2);

                sqlCommand2.Parameters.Add(new MySqlParameter("@topicIdValue", topicID));
                sqlCommand2.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));
                sqlCommand2.Parameters.AddWithValue("@commentValue", HttpUtility.UrlDecode(comment));

                sqlConnection2.Open();
                try
                {
                    sqlCommand2.ExecuteNonQuery();

                }
                catch (Exception e)
                {
                }
                sqlConnection2.Close();



            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
        }

        [WebMethod(EnableSession = true)]
        public void SubmitComment(string topicId, string employeeId, string comment)
        {
            string sqlConnectionSring = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            string sqlSelect = "INSERT INTO `suggestions` (`TopicID`, `EmployeeID`, `SuggestionContent`) VALUES (@topicIdValue, @employeeIdValue, @commentValue);";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionSring);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@topicIdValue", HttpUtility.UrlDecode(topicId));
            sqlCommand.Parameters.AddWithValue("@employeeIdValue", HttpUtility.UrlDecode(employeeId));
            sqlCommand.Parameters.AddWithValue("@commentValue", HttpUtility.UrlDecode(comment));

            sqlConnection.Open();
            try
            {
                sqlCommand.ExecuteNonQuery();

                string sqlConnectionSring2 = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

                string sqlSelect2 = "UPDATE topic SET TopicRelevanceCounter=TopicRelevanceCounter+1 WHERE TopicID=@topicIdValue";
                
                MySqlConnection sqlConnection2 = new MySqlConnection(sqlConnectionSring2);
                MySqlCommand sqlCommand2 = new MySqlCommand(sqlSelect2, sqlConnection2);

                sqlCommand2.Parameters.AddWithValue("@topicIdValue", HttpUtility.UrlDecode(topicId));

                sqlConnection2.Open();
                try
                {
                    sqlCommand2.ExecuteNonQuery();

                }
                catch (Exception e)
                {
                }
                sqlConnection2.Close();
                
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
        }

        //////
        //get topics Filtered for auto refresh
        [WebMethod(EnableSession = true)]
        public Topic[] GetTopicsFiltered(string category, string location)
        {
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //sqlSelect = "SELECT * FROM topic WHERE TopicCategory=@categoryValue AND TopicLocation=@locationValue ORDER BY TopicRelevanceCounter @orderValue";
            string sqlSelect = "";
            if (category == "Category")
            {
                sqlSelect = "SELECT * FROM topic WHERE TopicLocation=@locationValue";
            }
            else if (location == "All")
            {
                sqlSelect = "SELECT * FROM topic WHERE TopicCategory=@categoryValue";
            }
            else if (category != "Category" && location != "All")
            {
                sqlSelect = "SELECT * FROM topic WHERE TopicCategory=@categoryValue AND TopicLocation=@locationValue";
            }

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            if (category == "Category")
            {
                sqlCommand.Parameters.AddWithValue("@locationValue", HttpUtility.UrlDecode(location));
            }
            else if (location == "All")
            {
                sqlCommand.Parameters.AddWithValue("@categoryValue", HttpUtility.UrlDecode(category));
            }
            else if (category != "Category" && location != "All")
            {
                sqlCommand.Parameters.AddWithValue("@categoryValue", HttpUtility.UrlDecode(category));
                sqlCommand.Parameters.AddWithValue("@locationValue", HttpUtility.UrlDecode(location));
            }
           

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();

            sqlDa.Fill(sqlDt);

            List<Topic> topics = new List<Topic>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                topics.Add(new Topic
                {
                    TopicID = Convert.ToInt32(sqlDt.Rows[i]["TopicID"]),
                    Title = sqlDt.Rows[i]["TopicTitle"].ToString(),
                    Category = sqlDt.Rows[i]["TopicCategory"].ToString(),
                    Location = sqlDt.Rows[i]["TopicLocation"].ToString(),
                    Relevance = Convert.ToInt32(sqlDt.Rows[i]["TopicRelevanceCounter"]),
                    Resolved = Convert.ToInt32(sqlDt.Rows[i]["Resolved"]),
                    Removed = Convert.ToInt32(sqlDt.Rows[i]["Removed"])
                });
            }
            return topics.ToArray();
        }
        //////

        //get topics
        [WebMethod(EnableSession = true)]
        public Topic[] GetTopics()
        {
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT * FROM topic ORDER BY TopicRelevanceCounter DESC";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();

            sqlDa.Fill(sqlDt);

            List<Topic> topics = new List<Topic>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                topics.Add(new Topic
                {
                    TopicID = Convert.ToInt32(sqlDt.Rows[i]["TopicID"]),
                    Title = sqlDt.Rows[i]["TopicTitle"].ToString(),
                    Category = sqlDt.Rows[i]["TopicCategory"].ToString(),
                    Location = sqlDt.Rows[i]["TopicLocation"].ToString(),
                    Relevance = Convert.ToInt32(sqlDt.Rows[i]["TopicRelevanceCounter"]),
                    Resolved = Convert.ToInt32(sqlDt.Rows[i]["Resolved"]),
                    Removed = Convert.ToInt32(sqlDt.Rows[i]["Removed"])
                });
            }
            return topics.ToArray();
        }

        //get topics to populate topic list in reverse order
        [WebMethod(EnableSession = true)]
        public Topic[] GetTopicsReverse()
        {
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT * FROM topic ORDER BY TopicRelevanceCounter ASC";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();

            sqlDa.Fill(sqlDt);

            List<Topic> topics = new List<Topic>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                topics.Add(new Topic
                {
                    TopicID = Convert.ToInt32(sqlDt.Rows[i]["TopicID"]),
                    Title = sqlDt.Rows[i]["TopicTitle"].ToString(),
                    Category = sqlDt.Rows[i]["TopicCategory"].ToString(),
                    Location = sqlDt.Rows[i]["TopicCategory"].ToString(),
                    Relevance = Convert.ToInt32(sqlDt.Rows[i]["TopicRelevanceCounter"]),
                    Resolved = Convert.ToInt32(sqlDt.Rows[i]["Resolved"]),
                    Removed = Convert.ToInt32(sqlDt.Rows[i]["Removed"])
                });
            }
            return topics.ToArray();
        }

        //get suggestions
        [WebMethod(EnableSession = true)]
        public Suggestion[] GetSuggestions()
        {
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT * FROM suggestions ORDER BY SuggestionID";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();

            sqlDa.Fill(sqlDt);

            List<Suggestion> suggestions = new List<Suggestion>();
            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                suggestions.Add(new Suggestion
                {
                    SuggestionID = Convert.ToInt32(sqlDt.Rows[i]["SuggestionID"]),
                    TopicID = Convert.ToInt32(sqlDt.Rows[i]["TopicID"]),
                    EmployeeID = sqlDt.Rows[i]["EmployeeID"].ToString(),
                    SuggestionContent = sqlDt.Rows[i]["SuggestionContent"].ToString(),
                    SuggestionAgreementCounter = Convert.ToInt32(sqlDt.Rows[i]["SuggestionAgreementCounter"]),
                    Solution = Convert.ToInt32(sqlDt.Rows[i]["Solution"]),
                    Removed = Convert.ToInt32(sqlDt.Rows[i]["Removed"])
                });
            }
            return suggestions.ToArray();
        }

        //change relevance of topic
        [WebMethod(EnableSession = true)]
        public string UpdateRelevance(string newRelevance, string topicId)
        {
            string ret = "9";
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "UPDATE topic SET TopicRelevanceCounter=@newRelevanceValue WHERE TopicID=@topicIdValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@newRelevanceValue", HttpUtility.UrlDecode(newRelevance));
            sqlCommand.Parameters.AddWithValue("@topicIdValue", HttpUtility.UrlDecode(topicId));

            sqlConnection.Open();
            try
            {
                //ret = topicId;
                ret = "good";
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                ret = "bad";
                //ret = topicId+10000;
            }
            sqlConnection.Close();
            return ret;
        }

        //change agree of suggestion
        [WebMethod(EnableSession = true)]
        public string UpdateAgree(string newAgree, string suggestionId)
        {
            string ret = "9";
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "UPDATE suggestions SET SuggestionAgreementCounter=@newAgreeValue WHERE SuggestionID=@suggestionIdValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@newAgreeValue", HttpUtility.UrlDecode(newAgree));
            sqlCommand.Parameters.AddWithValue("@suggestionIdValue", HttpUtility.UrlDecode(suggestionId));

            sqlConnection.Open();
            try
            {
                //ret = topicId;
                ret = "good";
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                ret = "bad";
                //ret = topicId+10000;
            }
            sqlConnection.Close();
            return ret;
        }
    }
}
