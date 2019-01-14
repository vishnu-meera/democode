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
    public class GetAllRoadMapsHandler : MediatR.IRequestHandler<GetAllRoadMaps, CountryRoadMapListModel>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings
        public GetAllRoadMapsHandler(IRepository repository)
        {
            _repository = repository;
        }


        public async Task<CountryRoadMapListModel> Handle(GetAllRoadMaps request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<CountryRoadMap>(nameof(CountryRoadMap), CountryPartionKey);

            if (items == null)
            {
                throw new NotFoundException(nameof(Country), request.Id);
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Country), request.Id);
            }

            return new CountryRoadMapListModel
            {
                Countries = items.Select(c => new CountryRoadMapModel
                {
                    CountryName = c.RowKey,
                    Status = c.CountryStatus,
                    RoadMapObject = c.RoadMapSummary
                }).ToList()
            };
        }
    }
}
