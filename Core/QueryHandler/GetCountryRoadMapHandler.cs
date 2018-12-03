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
    public class GetCountryRoadMapHandler : MediatR.IRequestHandler<GetCountryRoadMap, CountryRoadMapModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings
        public GetCountryRoadMapHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<CountryRoadMapModel> Handle(GetCountryRoadMap request, CancellationToken cancellationToken)
        {
            var item = await _repository.Get<CountryRoadMap>(nameof(CountryRoadMap), CountryPartionKey, request.CounryName);

            if (item == null)
            {
                return new CountryRoadMapModel
                {
                    CountryName = "No Data Found",
                    Status = "No Data Found",
                    RoadMapObject = ""
                };
            }

            return new CountryRoadMapModel
            {
                CountryName = item.RowKey,
                Status = item.CountryStatus,
                RoadMapObject = item.RoadMapSummary
            };
        }
    }
}
