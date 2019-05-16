// Copyright(c) Terawe Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
//using Core.Exceptions;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Queries;
using Core.Exceptions;

namespace Core.QueryHandler
{
    public class GetHvacDashboardDataHandler : MediatR.IRequestHandler<GetHvacDashboardData, HvacDataList>
    {
        private readonly IRepository _repository;
        private string partitionkey = "CA_Frenso";
        public GetHvacDashboardDataHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<HvacDataList> Handle(GetHvacDashboardData request, CancellationToken cancellationToken)
        {
            var items = await _repository.GetAll<Hvacdashboatdtable>(nameof(Hvacdashboatdtable), partitionkey);

            if (items == null)
            {
                throw new NotFoundException(nameof(Hvacdashboatdtable), request.by);
            }

            if (items.Count() == 0)
            {
                throw new NotFoundException(nameof(Hvacdashboatdtable), request.by);
            }

            return new HvacDataList
            {
                Countries = items.Select(item => new HvacDashBoardTableModel
                {
                    PartitionKey = item.PartitionKey,
                    RowKey = item.RowKey,
                    Alert = item.Alert,
                    BatchId = item.BatchId,
                    MTemperature = item.MTemperature,
                    MPressure = item.MPressure,
                    ATemperature = item.ATemperature,
                    AHumidity = item.AHumidity,
                    TimeCreated = item.TimeCreated
                }).ToList()
            };
        }
    }
}
