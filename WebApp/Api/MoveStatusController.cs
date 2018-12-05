// Copyright(c) Microsoft Corporation. 
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
    public class MoveStatusController : BaseController
    {

        //GET : api/Country ==> ALL Countries
        [HttpGet]
        [ProducesResponseType(typeof(DataCenterMoveStatusModel), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAll([FromQuery] GetAllMoveStatus query)
        {
            return Ok(await Mediator.Send(query));
        }

    }
}
