// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using Core.Interfaces;
using Core.Entities;
using Core.Sharedkernel;
using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;
using Infrastructure.Config;

namespace Infrastructure.Data
{
    public class DataRepository : IRepository
    {
        private readonly Dictionary<string, CloudTable> tableList;
        private readonly Dictionary<string, CloudTable> backUpTableList;
        public DataRepository()
        {
            tableList = TableStorageConfig.Instance;
            backUpTableList = TableStorageConfig.BackUpInstance;
        }

        public async Task<string> Add<T>(T entity, string tableName) where T : BaseEntity, new()
        {
            // Create the InsertOrReplace TableOperation.
            TableOperation insertOrReplaceOperation = TableOperation.InsertOrReplace(entity);

            // Execute the insert operation.
            var temp = await tableList[tableName].ExecuteAsync(insertOrReplaceOperation);

            return entity.RowKey;
        }


        public async Task<int> AddAll<T>(IEnumerable<T> entityList, string tableName) where T : BaseEntity, new()
        {
            // Create the InsertOrReplace TableOperation.
            TableBatchOperation batchOperation = new TableBatchOperation();
            foreach (var entity in entityList)
            {
                batchOperation.InsertOrReplace(entity);
            }
            // Execute the batch operation.
            var temp = await backUpTableList[tableName].ExecuteBatchAsync(batchOperation);

            return temp.Count;
        }

        public async Task<T> Get<T>(string tableName, string partionkey, string rowkey) where T : BaseEntity, new()
        {
            // Create a retrieve operation that takes a customer entity.
            TableOperation retrieveOperation = TableOperation.Retrieve<T>(partionkey, rowkey);

            // Execute the retrieve operation.
            TableResult retrievedResult = await tableList[tableName].ExecuteAsync(retrieveOperation);

            return (T)retrievedResult.Result;

        }

        public async Task<IEnumerable<T>> GetAllQithoutPartition<T>(string tableName) where T : BaseEntity, new()
        {
            var range = new List<T>();
            TableQuery<T> tableQuery = new TableQuery<T>();
            TableContinuationToken continuationToken = null;

            do
            {
                TableQuerySegment<T> tableQueryResult = await tableList[tableName].ExecuteQuerySegmentedAsync(tableQuery, continuationToken);
                continuationToken = tableQueryResult.ContinuationToken;

                foreach (var t in tableQueryResult.Results)
                {
                    range.Add(t);
                }
                
            } while (continuationToken != null);

            return range;
        }

        public async Task<IEnumerable<T>> GetAll<T>(string tableName, string partionkey) where T : BaseEntity, new()
        {

            var range = new List<T>();
            var query = new TableQuery<T> ().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partionkey));
            TableContinuationToken token = null;
            do
            {
                TableQuerySegment<T> resultSegment = await tableList[tableName].ExecuteQuerySegmentedAsync(query, token);
                token = resultSegment.ContinuationToken;

                foreach (var t in resultSegment.Results)
                {
                    range.Add(t);
                }
            } while (token != null);

            return range;
        }

        public Task<string> Update<T>(T entity, string tableName) where T : BaseEntity, new()
        {
            throw new NotImplementedException();
        }
    }
}
