import os
import re
import random
from typing import Dict, Tuple

_DATASET_DIR = os.getenv("DATASET_DIR", "dataset")
_FRUIT_DAYS_CACHE: Dict[str, float] | None = None

_RANGE_RE = re.compile(r"^(?P<fruit>[^\(]+)\((?P<lo>\d+)-(?P<hi>\d+)\)$", re.IGNORECASE)


def _parse_dir_name(name: str) -> Tuple[str | None, float | None]:
	m = _RANGE_RE.match(name.strip())
	if not m:
		return None, None
	fruit = m.group("fruit").strip().lower()
	lo = float(m.group("lo"))
	hi = float(m.group("hi"))
	avg = (lo + hi) / 2.0
	return fruit, avg


def get_fruit_avg_days(sample_ratio: float = 0.5) -> Dict[str, float]:
	global _FRUIT_DAYS_CACHE
	if _FRUIT_DAYS_CACHE is not None:
		return _FRUIT_DAYS_CACHE

	fruit_to_values: Dict[str, list[float]] = {}
	if not os.path.isdir(_DATASET_DIR):
		_FRUIT_DAYS_CACHE = {}
		return _FRUIT_DAYS_CACHE

	# Iterate top-level subfolders only (Apple(1-5), Banana(5-10), etc.)
	for entry in os.listdir(_DATASET_DIR):
		path = os.path.join(_DATASET_DIR, entry)
		if not os.path.isdir(path):
			continue
		fruit, avg = _parse_dir_name(entry)
		if fruit is None or avg is None:
			continue
		# Randomly sample ~50% of folders to honor sampling requirement
		if random.random() > sample_ratio:
			continue
		fruit_to_values.setdefault(fruit, []).append(avg)

	# Compute averages
	result: Dict[str, float] = {}
	for fruit, values in fruit_to_values.items():
		if not values:
			continue
		result[fruit] = sum(values) / len(values)

	_FRUIT_DAYS_CACHE = result
	return result

