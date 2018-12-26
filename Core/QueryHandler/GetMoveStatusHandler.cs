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
    public class GetMoveStatusHandler : MediatR.IRequestHandler<GetMoveStatus, DataCenterMoveStatusModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public GetMoveStatusHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<DataCenterMoveStatusModel> Handle(GetMoveStatus request, CancellationToken cancellationToken)
        {
            var item = await _repository.Get<DataCenterMoveStatus>(nameof(DataCenterMoveStatus), CountryPartionKey,request.Country);

            return new DataCenterMoveStatusModel
            {
                RowKey = item.RowKey,
                moveStatusPercentageObj = item.moveStatusPercentageObj,
                moveStatusItems = item.moveStatusItems
            };
        }
    }
}
