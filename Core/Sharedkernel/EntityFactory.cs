// Copyright(c) Microsoft Corporation. 
// All rights reserved.
// Licensed under the MIT license. See LICENSE file in the solution root folder for full license information
using Core.Entities;

namespace Core.Sharedkernel
{
    public class EntityFactory
    {
        static public BaseEntity CreateandReturn(string name)
        {
            BaseEntity obj = null;

            switch (name)
            {
                case "Country":
                    obj = new Country();
                    break;
                default:
                    obj = new Country();
                    break;
            }
            return obj;

        }
    }
}
