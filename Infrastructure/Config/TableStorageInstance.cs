// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Infrastructure.Config
{
    public class TableStorageInstance : ITableStorageInstance
    {
        private Dictionary<string, CloudTable> instance;
        private Dictionary<string, CloudTable> backupinstance;
        private readonly ConfigOption _tableConfig;
        public TableStorageInstance(IOptionsMonitor<ConfigOption> tableConfig)
        {
            _tableConfig = tableConfig.CurrentValue;
            instance = GetTableInstance(_tableConfig.ConnectionStringMainTable, _tableConfig.CountryList);
            
        }

        private Dictionary<string, CloudTable> GetTableInstance(string connectionStringMainTable, string countryList)
        {
            var tempInstance = new Dictionary<string, CloudTable>();

            foreach (var tablename in countryList.Split(",").ToList())
            {
                try
                {
                    tempInstance.Add(tablename, GetOrCreateBlobTable(tablename, connectionStringMainTable));
                }
                catch {}
            }

            return tempInstance;
        }

        public Dictionary<string, CloudTable> GetAzureTableStorageBackUpInstance()
        {
            return backupinstance;
        }

        public Dictionary<string, CloudTable> GetAzureTableStorageInstance()
        {
            return instance;
        }

        private static CloudTable GetOrCreateBlobTable(string tableName,string connectionstring)
        {
            CloudTable table = null;
            try
            {

                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionstring);
                // Create the table client.
                CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

                // Retrieve a reference to the table.
                table = tableClient.GetTableReference(tableName);
            }
            catch {}

            return table;
        }
    }
}
