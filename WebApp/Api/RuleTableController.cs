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

namespace WebApp.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class RuleTableController : BaseController
    {
        //GET : api/Country ==> ALL Countries
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RuleTableListModel>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAll([FromQuery] GetRuleTable query)
        {
            return Ok(await Mediator.Send(query));
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> Migrate()
        {
            return Ok(await Mediator.Send(new MigrateRuleTable { Name = "Rules" }));
        }

    }
}
