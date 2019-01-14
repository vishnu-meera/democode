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
    //[Authorize(AuthenticationSchemes = "AzureAdBearer")]
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

        // POST: api/RoadMap
        [HttpPost]
        [ProducesResponseType(typeof(CountryModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Add([FromBody] AddCountry command)
        {
            var CountryName = await Mediator.Send(command);

            return CreatedAtAction("Get", new { CounryName = CountryName });
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> Migrate()
        {
            return Ok(await Mediator.Send(new MigrateCountry { Name="Country" }));
        }
    }
}
