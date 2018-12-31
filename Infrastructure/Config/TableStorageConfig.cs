// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
//using System.Configuration;
namespace Infrastructure.Config
{
    public sealed class TableStorageConfig
    {
        static Dictionary<string, CloudTable> instance = null;
        static Dictionary<string, CloudTable> backupinstance = null;
        static readonly object padlock = new object();

        //static string cs = System.Configuration.ConfigurationManager.AppSettings["StorageConnectionString"];
        TableStorageConfig(){}

        public static Dictionary<string, CloudTable> Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new Dictionary<string, CloudTable>();
                        instance.Add("Country", GetOrCreateBlobTable("Country"));
                        instance.Add("CountryDataCenters", GetOrCreateBlobTable("CountryDataCenters"));
                        instance.Add("CountryRoadMap", GetOrCreateBlobTable("CountryRoadMap"));
                        instance.Add("DataCenterMoveStatus", GetOrCreateBlobTable("DataCenterMoveStatus"));
                        instance.Add("CountryWorkLoad", GetOrCreateBlobTable("CountryWorkLoad"));
                        instance.Add("RuleTable", GetOrCreateBlobTable("RuleTable"));
                    }
                    return instance;
                }
            }
        }

        public static Dictionary<string, CloudTable> BackUpInstance
        {
            get
            {
                lock (padlock)
                {
                    if (backupinstance == null)
                    {
                        backupinstance = new Dictionary<string, CloudTable>();
                        backupinstance.Add("Country", GetOrCreateBlobTableBackUp("Country"));
                        backupinstance.Add("CountryDataCenters", GetOrCreateBlobTableBackUp("CountryDataCenters"));
                        backupinstance.Add("CountryRoadMap", GetOrCreateBlobTableBackUp("CountryRoadMap"));
                        backupinstance.Add("DataCenterMoveStatus", GetOrCreateBlobTableBackUp("DataCenterMoveStatus"));
                        backupinstance.Add("CountryWorkLoad", GetOrCreateBlobTableBackUp("CountryWorkLoad"));
                        backupinstance.Add("RuleTable", GetOrCreateBlobTableBackUp("RuleTable"));
                    }
                    return backupinstance;
                }
            }
        }

        private static CloudTable GetOrCreateBlobTable(string tableName)
        {
            CloudTable table = null;
            try
            {
                var storageTableConnectionString = "DefaultEndpointsProtocol=https;AccountName=golocaldashboardapp;AccountKey=B8+vdC+QXHLvLrRffr1aQd1T4EchD6n/LpUzOtnB2BOpOcUR6asQXszYLJxfYSRpR3M73c7CivG2oI3W2+4KtQ==;EndpointSuffix=core.windows.net";
                
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageTableConnectionString);
                // Create the table client.
                CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

                // Retrieve a reference to the table.
                table = tableClient.GetTableReference(tableName);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return table;
        }

        private static CloudTable GetOrCreateBlobTableBackUp(string tableName)
        {
            CloudTable table = null;
            try
            {
                var storageTableConnectionString = "DefaultEndpointsProtocol=https;AccountName=golocaldashboardappbkup;AccountKey=Ix2FUA1na9bJ2vZ71tzelVpPIaFbsTX5vILoaEGaZhIUbe3wr/vsfPDLR90/W8kyD/uZp60kQWBXVaxsMVuqDw==;EndpointSuffix=core.windows.net";
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageTableConnectionString);
                // Create the table client.
                CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

                // Retrieve a reference to the table.
                table = tableClient.GetTableReference(tableName);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return table;
        }

    }
}
