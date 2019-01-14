// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Core.Models;
using Core.Queries;
using Microsoft.AspNetCore.Authorization;

namespace WebApp.Api
{
    //[Authorize(AuthenticationSchemes = "AzureAdBearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesStatusController : BaseController
    {

        //GET : api/CountriesStatus ==> Overall Status Counts
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<StatusList>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get([FromQuery] GetStatusCount query)
        {
            return Ok(await Mediator.Send(query));
        }

        // GET: api/Country/USA ==> Country by name
        [HttpGet("{ByCountryCode}")]
        [ProducesResponseType(typeof(CountryModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string ByCountryCode)
        {
            return Ok(await Mediator.Send(new GetStatus { by = ByCountryCode }));
        }

    }
}
