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
    public class GetDataCenterHandler : MediatR.IRequestHandler<GetDataCenter, CountryDataCentersModel>
    {
        private readonly IRepository _repository;

        public GetDataCenterHandler(IRepository repository)
        {
            _repository = repository;
        }


        public async Task<CountryDataCentersModel> Handle(GetDataCenter request, CancellationToken cancellationToken)
        {
            var item = await _repository.Get<CountryDataCenters>(nameof(CountryDataCenters), request.Country, request.DcCode);

            if (item == null)
            {
                throw new NotFoundException(nameof(Country), request.DcCode);
            }

            return new CountryDataCentersModel
            {
                DataCenterName = item.DataCenterName,
                DataCenterStatus = item.DataCenterStatus,
                TimeLine = item.TImeLine,
                WorkLoads = item.WorkLoads
            };
        }
    }
}
