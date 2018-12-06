﻿// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core.Models;
using Core.Queries;

namespace WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryDataCentersController : BaseController
    {
        // GET: api/Country/USA ==> Country by name
        [HttpGet("{country}/{datacentercode}")]
        [ProducesResponseType(typeof(CountryDataCentersModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string country,string datacentercode)
        {
            return Ok(await Mediator.Send(new GetDataCenter { DcCode = datacentercode, Country = country }));
        }

    }
}
