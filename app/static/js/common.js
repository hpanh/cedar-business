//Require jquery to work properly


//Require a button with '.js-fb-share' and fblogin file
$('.js-fb-share').click(function() {
    FB.ui({
        method: 'share',
        href: document.URL
    }, function(response) {
        //TODO: handle response
    });
});

function parsePxToNumber(string) {
    var number = string.split('px')[0];
    return Number(number);
};

function lazyload(selector) {
    var lazyEvent = "sporty";
    selector.lazyload({
        event: lazyEvent,
        effect : "fadeIn",
    });

    setTimeout(function() {
        selector.trigger(lazyEvent);
    }, 0);
}

/*
Item display order after arranged will base on the input data order.
Priority will decrease as the data array order increase. E.g element at data[0] will has
the highest priority, element at data[1] will have lower priority than data[0] but
higher than all other elements.

Sample input structure.
data = [
    {
        datalist: [],
        initDistance: 1,
        distance: 2,
        cellSpan: 1,
    },
    {
        datalist: [],
        ...
    }
]

mainData = {
    datalist: [],
    cellSpan: 1,
}
*/
function arrangeExplorer(mainData, data, options) {
    if (data.length <= 0) {
        return;
    };

    var defaultOptions = {
        cellPerRow: 5,
    }

    var arrangedArray = [];
    var setting = $.extend({}, defaultOptions, options);
    var defaultDatalist = mainData.datalist;
    data.forEach(initCurrentDistanceProperty);

    while (defaultDatalist.length > 0) {
        var remainingCellSpan = setting.cellPerRow;

        for (var i = 0; i < setting.cellPerRow && remainingCellSpan >= 0; i++) {
            var item = findItemToArrangedArray(data, remainingCellSpan);

            if (item) {
                arrangedArray.push(item.objectItem);
                remainingCellSpan -= item.cellSpan;
            } else if(defaultDatalist.length > 0 && remainingCellSpan >= mainData.cellSpan) {
                arrangedArray.push(getDataItem(mainData.datalist));
                remainingCellSpan -= mainData.cellSpan;
            }
        };
    }

    return arrangedArray;

    function findItemToArrangedArray(data, remainingCellSpan) {
        var foundItem = null;

        for (var i = 0; i < data.length; i++) {
            var datalistObj = data[i];
            if (datalistObj.initDistance != undefined) {
                if (datalistObj.initDistance <= 0 && remainingCellSpan >= datalistObj.cellSpan) {
                    delete datalistObj.initDistance;
                    foundItem = {
                        objectItem: getDataItem(datalistObj.datalist),
                        cellSpan: datalistObj.cellSpan
                    };
                    break;
                } else {
                    datalistObj.initDistance--;
                }
            } else {
                if (datalistObj.currentDistanceFromPrevious >= datalistObj.distance
                && remainingCellSpan >= datalistObj.cellSpan) {
                    foundItem = {
                        objectItem: getDataItem(datalistObj.datalist),
                        cellSpan: datalistObj.cellSpan
                    };
                    datalistObj.currentDistanceFromPrevious = 0;
                    break;
                } else {
                    datalistObj.currentDistanceFromPrevious++;
                }
            }

            if (datalistObj.datalist.length == 0) {
                var index = data.indexOf(datalistObj);
                if (index > -1) {
                    data.splice(index, 1);
                };
            };
        };

        return foundItem;
    }

    function getDataItem(arrayData) {
        return arrayData.splice(0, 1)[0];
    }

    function initCurrentDistanceProperty(element) {
        element.currentDistanceFromPrevious = 0;
    }
}

function hideModal(modalId) {
    $('#' + modalId).modal('hide');
}