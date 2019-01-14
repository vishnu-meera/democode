// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information


namespace Core.Models
{
    public class DataCenterMoveStatusModel
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }

        public string moveStatusPercentageObj { get; set; }
        public string moveStatusItems { get; set; }
    }
}
