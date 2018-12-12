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

namespace WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryWorkLoadController : BaseController
    {
        // GET: api/Country/USA ==> Country by name
        [HttpGet("{partionkey}")]
        [ProducesResponseType(typeof(CountryWorkLoadListModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string partionkey)
        {
            return Ok(await Mediator.Send(new GeAlltWorkLoads { partionKey = partionkey }));
        }

        // POST: api/RoadMap
        [HttpPost]
        [ProducesResponseType(typeof(CountryWorkLoadModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Add([FromBody] AddWorkLoad command)
        {
            var CountryName = await Mediator.Send(command);

            return CreatedAtAction("Get", new { CounryName = CountryName });
        }

    }
}
