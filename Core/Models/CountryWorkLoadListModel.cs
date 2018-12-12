using System;
// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information


using System.Collections.Generic;


namespace Core.Models
{
    public class CountryWorkLoadListModel
    {
        public IEnumerable<CountryWorkLoadModel> countryWorkLoads { get; set; }
    }
}
