// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Sharedkernel;

namespace Core.Interfaces
{
    public interface IRepository
    {
        Task<T> Get<T>(string entityName, string partionkey, string rowkey) where T : BaseEntity, new();
        Task<IEnumerable<T>> GetAll<T>(string entityName, string partionkey) where T : BaseEntity, new();
        Task<string> Add<T>(T entity, string tableName) where T : BaseEntity, new();
        Task<string> Update<T>(T entity, string tableName) where T : BaseEntity, new();

    }
}
