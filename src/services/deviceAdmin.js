/**
 * Admin operations on trackers: registering stock (IMEI + SIM) with a new
 * activation code, resetting codes, suspending. Used by the admin CLI and
 * the admin API.
 */
const devices = require('../db/repositories/devices');
const { generateActivationCode, hashActivationCode } = require('../lib/secrets');
const { badRequest, conflict, notFound } = require('../lib/errors');

const IMEI_RE = /^\d{15}$/;
const STATUSES = ['inventory', 'active', 'suspended'];

function assertImei(imei) {
  if (!IMEI_RE.test(String(imei || ''))) throw badRequest(`IMEI must be exactly 15 digits (got "${imei}")`);
}

/**
 * Registers a tracker. Returns the plain activation code ONCE; only its hash
 * is stored, so print it on the box now.
 */
async function registerDevice({ imei, simNumber = null, model = 'GT06N', name = null }) {
  assertImei(imei);
  const activationCode = generateActivationCode();
  try {
    const device = await devices.create({
      imei,
      simNumber,
      model,
      name,
      activationCodeHash: await hashActivationCode(activationCode),
    });
    return { device, activationCode };
  } catch (err) {
    if (err.code === 'P2002') throw conflict(`Device with IMEI ${imei} is already registered`);
    throw err;
  }
}

async function resetActivationCode(imei) {
  assertImei(imei);
  const activationCode = generateActivationCode();
  try {
    const device = await devices.setActivationCodeHash(imei, await hashActivationCode(activationCode));
    return { device, activationCode };
  } catch (err) {
    if (err.code === 'P2025') throw notFound(`No device with IMEI ${imei}`);
    throw err;
  }
}

async function setStatus(imei, status) {
  assertImei(imei);
  if (!STATUSES.includes(status)) throw badRequest(`status must be one of ${STATUSES.join(', ')}`);
  try {
    return await devices.setStatus(imei, status);
  } catch (err) {
    if (err.code === 'P2025') throw notFound(`No device with IMEI ${imei}`);
    throw err;
  }
}

/** Edit stock details (SIM number, model, name). */
async function updateDetails(imei, data) {
  assertImei(imei);
  try {
    return await devices.updateDetails(imei, data);
  } catch (err) {
    if (err.code === 'P2025') throw notFound(`No device with IMEI ${imei}`);
    throw err;
  }
}

/**
 * Deletes a tracker and ALL its data. Refused while a customer owns it
 * (release it first) unless force is set.
 */
async function deleteDevice(imei, { force = false } = {}) {
  const device = await getByImei(imei);
  if (device.status === 'active' && !force) {
    throw conflict('This tracker belongs to a customer. Release it first (or delete with force).');
  }
  await devices.remove(device.id);
  return device;
}

async function getByImei(imei) {
  assertImei(imei);
  const device = await devices.findByImei(imei);
  if (!device) throw notFound(`No device with IMEI ${imei}`);
  return device;
}

module.exports = {
  registerDevice, resetActivationCode, setStatus, updateDetails, deleteDevice, getByImei, assertImei, STATUSES,
};
