// Copyright(c) Terawe Corporation. 
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
    [Route("api/[controller]")]
    [ApiController]
    public class HvacDataController : BaseController
    {
        // GET: api/Country/USA ==> Country by name
        [HttpGet("{ByStatecode}")]
        [ProducesResponseType(typeof(HvacDashBoardTableModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Get(string ByStatecode)
        {
            return Ok(await Mediator.Send(new GetHvacDashboardData { by = ByStatecode }));
        }
    }
}