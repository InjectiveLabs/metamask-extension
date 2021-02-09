import assert from 'assert';
import sinon from 'sinon';
import { ObservableStore } from '@metamask/obs-store';
import TokenRatesController from '../../../../app/scripts/controllers/token-rates';

describe('TokenRatesController', function () {
  let onNetworkDidChange;
  let nativeCurrency;
  let getNativeCurrency;
  beforeEach(function () {
    onNetworkDidChange = sinon.spy();
    nativeCurrency = 'ETH';
    getNativeCurrency = () => nativeCurrency;
  });
  it('should listen for preferences store updates', function () {
    const preferences = new ObservableStore({ tokens: [] });
    preferences.putState({ tokens: ['foo'] });
    const controller = new TokenRatesController({
      preferences,
      onNetworkDidChange,
      getNativeCurrency,
    });
    assert.deepEqual(controller._tokens, ['foo']);
  });

  it('should poll on correct interval', async function () {
    const stub = sinon.stub(global, 'setInterval');
    const preferences = new ObservableStore({ tokens: [] });
    preferences.putState({ tokens: ['foo'] });
    const controller = new TokenRatesController({
      preferences,
      onNetworkDidChange,
      getNativeCurrency,
    });
    controller.start(1337);

    assert.strictEqual(stub.getCall(0).args[1], 1337);
    stub.restore();
    controller.stop();
  });

  it('should update native currency if network changes', async function () {
    const preferences = new ObservableStore({ tokens: [] });
    preferences.putState({ tokens: ['foo'] });
    const controller = new TokenRatesController({
      preferences,
      onNetworkDidChange,
      getNativeCurrency,
    });
    nativeCurrency = 'xDAI';
    onNetworkDidChange.getCall(0).args[0]();
    assert.strictEqual(controller.nativeCurrency, 'xDAI');
  });

  it('should update exchange rates if network changes', async function () {
    const preferences = new ObservableStore({ tokens: [] });
    preferences.putState({ tokens: ['foo'] });
    const controller = new TokenRatesController({
      preferences,
      onNetworkDidChange,
      getNativeCurrency,
    });
    sinon.spy(controller, 'updateExchangeRates');
    onNetworkDidChange.getCall(0).args[0]();
    assert(controller.updateExchangeRates.calledOnce);
  });
});
