// Copyright(c) Terawe Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information


using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Models
{
    public class HvacDashBoardTableModel
    {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string Alert { get; set; }
        public string BatchId { get; set; }
        public double MTemperature { get; set; }
        public double MPressure { get; set; }
        public double ATemperature { get; set; }
        public double AHumidity { get; set; }
        public DateTime TimeCreated { get; set; }
    }
}
