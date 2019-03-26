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


        //edit user
        [WebMethod(EnableSession = true)]
        public void EditUser(string employeeId, string password)
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

        //add topic
        [WebMethod(EnableSession = true)]
        public string SubmitTopic(string topicTitle, string category, string location, string comment)
        {
            string sqlConnectionSring = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;

            string sqlSelect = "INSERT INTO topics (TopicTitle, TopicCategory, TopicLocation) VALUES (@topicTitleValue, @categoryValue, @locationValue);";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectionSring);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@topicTitleValue", HttpUtility.UrlDecode(topicTitle));
            sqlCommand.Parameters.AddWithValue("@categoryValue", HttpUtility.UrlDecode(category));
            sqlCommand.Parameters.AddWithValue("@locationValue", HttpUtility.UrlDecode(location));
            sqlCommand.Parameters.AddWithValue("@commentValue", HttpUtility.UrlDecode(comment));

            sqlConnection.Open();
            try
            {
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();

            return topicTitle;
        }

        //get topics to populate topic list
        [WebMethod(EnableSession = true)]
        public Topic[] GetTopics()
        {
            string sqlConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT TopicTitle, TopicRelevanceCounter FROM topics";

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
                    Title = sqlDt.Rows[i]["TopicTitle"].ToString(),
                    Relevance = Convert.ToInt32(sqlDt.Rows[i]["TopicRelevanceCounter"])
                });
            }
            return topics.ToArray();
        }
    }
}
