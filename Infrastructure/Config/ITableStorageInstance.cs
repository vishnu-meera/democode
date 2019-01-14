// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information


using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace Infrastructure.Config
{
    public interface ITableStorageInstance
    {
        Dictionary<string, CloudTable> GetAzureTableStorageInstance();
        Dictionary<string, CloudTable> GetAzureTableStorageBackUpInstance();
    }
}
