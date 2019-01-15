// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core.Models;
using Core.Queries;
using Core.Commands;
using Core.MigrationQueries;
using Microsoft.AspNetCore.Authorization;

namespace WebApp.Api
{
    [Authorize(AuthenticationSchemes = "AzureAdBearer")]
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

        // POST: api/RoadMap
        [HttpPost]
        [ProducesResponseType(typeof(CountryDataCentersModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Add([FromBody] AddDataCenter command)
        {
            var CountryName = await Mediator.Send(command);

            return CreatedAtAction("Get", new { CounryName = CountryName });
        }
        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> Migrate()
        {
            return Ok(await Mediator.Send(new MigrateCountryDataCenters { Name = "Country" }));
        }

    }
}
