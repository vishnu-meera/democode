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
using System.Collections.Generic;

namespace Core.QueryHandler
{
    public class GetStatusCountQueryHandler : MediatR.IRequestHandler<GetStatusCount, StatusList>
    {
        private readonly IRepository _repository;
        private readonly string CountryPartionKey = "Countries"; //get it from appsettings

        public GetStatusCountQueryHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<StatusList> Handle(GetStatusCount request, CancellationToken cancellationToken)
        {
            var statusList = new StatusList();

            statusList.CountriesStatusList = new Dictionary<string, int>();

            var items = await _repository.GetAll<Country>(nameof(Country), CountryPartionKey);
            foreach (var item in items)
            {
                statusList.CountriesStatusList.TryGetValue(item.Status, out var currentCount);
                statusList.CountriesStatusList[item.Status] = currentCount + 1;
            }

            if (items == null)
            {
                throw new NotFoundException(nameof(Country), "Countries Overall Status Check");
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Country), "Countries Overall Status Check");
            }

            return statusList;
        }
    }
}
