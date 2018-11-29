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
    public class CountryController : BaseController
    {
        //GET : api/Country ==> ALL Countries
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CountryListModel>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllCountries query)
        {
            return Ok(await Mediator.Send(query));
        }


        // GET: api/Country/USA ==> Country by name
        [HttpGet("{name}")]
        [ProducesResponseType(typeof(CountryModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string name)
        {
            return Ok(await Mediator.Send(new GetCountry { Name = name }));
        }
    }
}
