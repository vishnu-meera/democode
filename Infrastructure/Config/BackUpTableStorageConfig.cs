// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Infrastructure.Config
{
    public sealed class BackUpTableStorageConfig
    {
        static Dictionary<string, CloudTable> instance = null;
        static readonly object padlock = new object();
        BackUpTableStorageConfig() { }
        public static Dictionary<string, CloudTable> Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new Dictionary<string, CloudTable>();
                        instance.Add("Country", GetOrCreateBlobTableBackUp("Country"));
                        instance.Add("CountryDataCenters", GetOrCreateBlobTableBackUp("CountryDataCenters"));
                        instance.Add("CountryRoadMap", GetOrCreateBlobTableBackUp("CountryRoadMap"));
                        instance.Add("DataCenterMoveStatus", GetOrCreateBlobTableBackUp("DataCenterMoveStatus"));
                        instance.Add("CountryWorkLoad", GetOrCreateBlobTableBackUp("CountryWorkLoad"));
                        instance.Add("RuleTable", GetOrCreateBlobTableBackUp("RuleTable"));
                    }
                    return instance;
                }
            }
        }

        private static CloudTable GetOrCreateBlobTableBackUp(string tableName)
        {
            CloudTable table = null;
            try
            {
                var storageTableConnectionString = "DefaultEndpointsProtocol=https;AccountName=golocaldashboarddbbakup;AccountKey=7W0r1vSED0K1fu/bKk4XxSvtu1jWaQB76vwo2z3N0Wqd9l1/uCEARyWlbbKD47O23IiAwcqoPN2VPDh7H2W0Pw==;EndpointSuffix=core.windows.net";
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
