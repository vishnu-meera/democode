// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information

using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Core.Entities;
using Core.Models;
using Core.Interfaces;
using Core.Commands;
using Core.Exceptions;
using MediatR;



namespace Core.CommandHandler
{
    public class AddMoveStatusHandler : IRequestHandler<AddMoveStatus, string>
    {
        private readonly IRepository _repository;

        public AddMoveStatusHandler(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<string> Handle(AddMoveStatus request, CancellationToken cancellationToken)
        {
            var entity = new DataCenterMoveStatus
            {
                PartitionKey = request.PartitionKey,
                RowKey = request.RowKey,
                moveStatusItems = request.moveStatusItems,
                moveStatusPercentageObj = request.moveStatusPercentageObj
            };

            var item = await _repository.Add<DataCenterMoveStatus>(entity, nameof(DataCenterMoveStatus));

            return item;
        }
    }
}
