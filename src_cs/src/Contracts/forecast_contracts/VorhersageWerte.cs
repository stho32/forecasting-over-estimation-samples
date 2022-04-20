﻿using System.Collections.Generic;

namespace forecast_contracts
{
    public record VorhersageWerte(
        IEnumerable<VorhersageWert> Werte
        );

    public record VorhersageWert(
            int    Dauer,
            double RelativeHäufigkeit,
            double KumulierteWahrscheinlichkeit
        );
}