// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;


namespace Core.QueryHandler
{
    public class GetAllMoveStatusHandler : MediatR.IRequestHandler<GetAllMoveStatus, DataCenterMoveStatusModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Country1"; //get it from appsettings

        public GetAllMoveStatusHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<DataCenterMoveStatusModel> Handle(GetAllMoveStatus request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<DataCenterMoveStatus>(nameof(DataCenterMoveStatus), CountryPartionKey); 

            return new DataCenterMoveStatusModel
            {
                moveStatusPercentageObj = items.ToList()[0].moveStatusPercentageObj,
                moveStatusItems = items.ToList()[0].moveStatusItems
            };
        }
    }
}
